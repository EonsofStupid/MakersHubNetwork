
/**
 * Enhanced circuit breaker implementation for preventing infinite loops and cascading failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private readonly threshold: number;
  private readonly resetTimeout: number;
  private readonly name: string;
  private eventCounts: Record<string, number> = {};
  private lastEventTime: Record<string, number> = {};
  private maxEventsPerSecond: number;

  constructor(
    name: string, 
    threshold = 3, 
    resetTimeout = 30000, 
    maxEventsPerSecond = 10
  ) {
    this.name = name;
    this.threshold = threshold;
    this.resetTimeout = resetTimeout;
    this.maxEventsPerSecond = maxEventsPerSecond;
  }

  get isOpen(): boolean {
    // Reset if enough time has passed since last failure
    if (this.failures >= this.threshold && 
        Date.now() - this.lastFailure >= this.resetTimeout) {
      this.reset();
      return false;
    }
    
    return this.failures >= this.threshold;
  }

  recordSuccess(): void {
    this.reset();
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
    
    if (this.isOpen) {
      console.warn(`Circuit breaker '${this.name}' is now open`);
    }
  }

  reset(): void {
    this.failures = 0;
    this.eventCounts = {};
    this.lastEventTime = {};
  }

  /**
   * Checks if an event type is happening too frequently
   * @param eventType The type of event to check
   * @returns True if the event rate exceeds threshold, false otherwise
   */
  isRateLimited(eventType: string): boolean {
    const now = Date.now();
    const lastTime = this.lastEventTime[eventType] || 0;
    const timeDiff = now - lastTime;
    
    // Reset counter if more than 1 second has passed
    if (timeDiff > 1000) {
      this.eventCounts[eventType] = 1;
      this.lastEventTime[eventType] = now;
      return false;
    }
    
    // Increment counter
    this.eventCounts[eventType] = (this.eventCounts[eventType] || 0) + 1;
    this.lastEventTime[eventType] = now;
    
    // Check if rate exceeds threshold
    return this.eventCounts[eventType] > this.maxEventsPerSecond;
  }

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.isOpen) {
      console.warn(`Circuit breaker '${this.name}' is open, using fallback`);
      return fallback();
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      console.error(`Circuit breaker '${this.name}' caught error:`, error);
      return fallback();
    }
  }
}

// Create singleton instances for various services
export const themeServiceBreaker = new CircuitBreaker('theme-service', 2, 60000);
export const authServiceBreaker = new CircuitBreaker('auth-service', 3, 30000);
export const uiUpdateBreaker = new CircuitBreaker('ui-updates', 5, 5000, 20);
