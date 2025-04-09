
/**
 * Simple circuit breaker implementation
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private readonly threshold: number;
  private readonly resetTimeout: number;
  private readonly name: string;

  constructor(name: string, threshold = 3, resetTimeout = 30000) {
    this.name = name;
    this.threshold = threshold;
    this.resetTimeout = resetTimeout;
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
