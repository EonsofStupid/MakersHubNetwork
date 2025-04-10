
/**
 * CircuitBreaker - A utility to prevent infinite loops and recursion
 * Supports both static and instance usage patterns
 */

interface BreakerState {
  count: number;
  maxCount: number;
  resetTime: number;
  lastTripped: number;
  isOpen: boolean;
}

// Define the CircuitBreaker class
export class CircuitBreaker {
  private static breakers: Map<string, BreakerState> = new Map();
  private breakerId: string;
  private maxTriggerCount: number;
  private resetTimeMs: number;
  
  /**
   * Create a new circuit breaker instance
   */
  constructor(id: string, maxCount: number = 5, resetTimeMs: number = 5000) {
    this.breakerId = id;
    this.maxTriggerCount = maxCount;
    this.resetTimeMs = resetTimeMs;
    
    // Initialize the breaker if it doesn't exist in the static collection
    if (!CircuitBreaker.breakers.has(id)) {
      CircuitBreaker.breakers.set(id, {
        count: 0,
        maxCount,
        resetTime: resetTimeMs,
        lastTripped: 0,
        isOpen: false
      });
    }
  }
  
  /**
   * Check if this breaker is currently open/tripped
   */
  get isOpen(): boolean {
    return CircuitBreaker.isTripped(this.breakerId);
  }
  
  /**
   * Get current count for this breaker
   */
  get currentCount(): number {
    return CircuitBreaker.getCount(this.breakerId);
  }
  
  /**
   * Increment count for this breaker
   * @param amount Amount to increment (default 1)
   * @returns Current count after increment
   */
  count(amount: number = 1): number {
    return CircuitBreaker.count(this.breakerId, amount);
  }
  
  /**
   * Reset this breaker
   */
  reset(): void {
    CircuitBreaker.reset(this.breakerId);
  }
  
  /**
   * Record a successful operation - reduces count
   */
  recordSuccess(): void {
    CircuitBreaker.recordSuccess(this.breakerId);
  }
  
  /**
   * Record a failure - increases count
   */
  recordFailure(): void {
    CircuitBreaker.recordFailure(this.breakerId);
  }
  
  /**
   * Execute a function with circuit breaker protection
   * @param fn Function to execute
   * @param fallbackFn Fallback function if circuit is open
   * @returns Result of fn or fallbackFn
   */
  execute<T>(fn: () => T | Promise<T>, fallbackFn?: () => T | Promise<T>): Promise<T> {
    return CircuitBreaker.execute(this.breakerId, fn, fallbackFn);
  }
  
  // Static methods
  
  /**
   * Initialize a circuit breaker
   * @param id Unique identifier for this breaker
   * @param maxCount Maximum count before tripping (default 5)
   * @param resetTimeMs Time in ms before auto-resetting (default 5000ms)
   */
  static init(id: string, maxCount: number = 5, resetTimeMs: number = 5000): void {
    if (!CircuitBreaker.breakers.has(id)) {
      CircuitBreaker.breakers.set(id, {
        count: 0,
        maxCount,
        resetTime: resetTimeMs,
        lastTripped: 0,
        isOpen: false
      });
    }
  }
  
  /**
   * Check if breaker is tripped/open
   * @param id Unique identifier
   */
  static isTripped(id: string): boolean {
    const breaker = CircuitBreaker.breakers.get(id);
    if (!breaker) return false;
    
    // Auto-reset if reset time has passed
    if (breaker.isOpen && Date.now() - breaker.lastTripped > breaker.resetTime) {
      breaker.isOpen = false;
      breaker.count = 0;
    }
    
    return breaker.isOpen;
  }
  
  /**
   * Increment count for this breaker
   * @param id Unique identifier
   * @param amount Amount to increment (default 1)
   */
  static count(id: string, amount: number = 1): number {
    const breaker = CircuitBreaker.breakers.get(id);
    if (!breaker) {
      CircuitBreaker.init(id);
      return CircuitBreaker.count(id, amount);
    }
    
    breaker.count += amount;
    
    // Trip the breaker if count exceeds max
    if (breaker.count >= breaker.maxCount && !breaker.isOpen) {
      breaker.isOpen = true;
      breaker.lastTripped = Date.now();
      console.warn(`Circuit breaker ${id} tripped at count ${breaker.count}`);
    }
    
    return breaker.count;
  }
  
  /**
   * Get current count for this breaker
   * @param id Unique identifier
   */
  static getCount(id: string): number {
    return CircuitBreaker.breakers.get(id)?.count || 0;
  }
  
  /**
   * Reset this breaker
   * @param id Unique identifier
   */
  static reset(id: string): void {
    const breaker = CircuitBreaker.breakers.get(id);
    if (breaker) {
      breaker.count = 0;
      breaker.isOpen = false;
    }
  }
  
  /**
   * Record a successful operation - reduces count
   * @param id Unique identifier
   */
  static recordSuccess(id: string): void {
    const breaker = CircuitBreaker.breakers.get(id);
    if (breaker && breaker.count > 0) {
      // Gradually decrease count on successful operations
      breaker.count = Math.max(0, breaker.count - 0.5);
    }
  }
  
  /**
   * Record a failure - increases count
   * @param id Unique identifier
   */
  static recordFailure(id: string): void {
    CircuitBreaker.count(id);
  }
  
  /**
   * Execute a function with circuit breaker protection
   * @param id Unique identifier
   * @param fn Function to execute
   * @param fallbackFn Fallback function if circuit is open
   * @returns Result of fn or fallbackFn
   */
  static async execute<T>(id: string, fn: () => T | Promise<T>, fallbackFn?: () => T | Promise<T>): Promise<T> {
    // Initialize the breaker if it doesn't exist
    if (!CircuitBreaker.breakers.has(id)) {
      CircuitBreaker.init(id);
    }
    
    // If circuit is open, use fallback if provided
    if (CircuitBreaker.isTripped(id)) {
      console.warn(`Circuit ${id} is open, using fallback`);
      if (fallbackFn) {
        return Promise.resolve(fallbackFn());
      }
      throw new Error(`Circuit ${id} is open and no fallback provided`);
    }
    
    try {
      // Execute the function
      const result = await Promise.resolve(fn());
      // Record success
      CircuitBreaker.recordSuccess(id);
      return result;
    } catch (error) {
      // Record failure
      CircuitBreaker.recordFailure(id);
      // Re-throw or use fallback
      if (fallbackFn) {
        console.warn(`Function execution failed for ${id}, using fallback`, error);
        return Promise.resolve(fallbackFn());
      }
      throw error;
    }
  }
}

// Export default instance for backward compatibility with singleton usage pattern
export default CircuitBreaker;
