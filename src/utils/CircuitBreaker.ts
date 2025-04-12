/**
 * CircuitBreaker utility to prevent infinite loops or excessive function calls
 * 
 * Usage:
 * const breaker = new CircuitBreaker('my-operation', 3, 1000);
 * 
 * if (breaker.isOpen) {
 *   console.warn('Circuit breaker is open, skipping operation');
 *   return;
 * }
 * 
 * try {
 *   // Your code that might cause issues if called too frequently
 *   breaker.success();
 * } catch (error) {
 *   breaker.fail();
 *   throw error;
 * }
 */
export class CircuitBreaker {
  private static instances: Record<string, CircuitBreaker> = {};

  private failCount: number = 0;
  private lastFailTime: number = 0;
  private _isOpen: boolean = false;

  /**
   * Creates a new CircuitBreaker instance or returns an existing one
   * 
   * @param id Unique identifier for this circuit breaker
   * @param maxFailures Number of failures before the circuit breaker opens
   * @param resetTimeMs Time in milliseconds before the circuit breaker resets
   */
  constructor(
    private id: string, 
    private maxFailures: number = 3,
    private resetTimeMs: number = 5000
  ) {
    // If an instance with this ID already exists, return it
    if (CircuitBreaker.instances[id]) {
      return CircuitBreaker.instances[id];
    }
    
    // Otherwise store this instance
    CircuitBreaker.instances[id] = this;
  }

  /**
   * Initialize a circuit breaker without creating a class instance
   */
  static init(id: string, maxFailures: number = 3, resetTimeMs: number = 5000): void {
    if (!CircuitBreaker.instances[id]) {
      CircuitBreaker.instances[id] = new CircuitBreaker(id, maxFailures, resetTimeMs);
    }
  }

  /**
   * Check if this circuit breaker is currently open (preventing operations)
   */
  get isOpen(): boolean {
    // If the circuit is open, check if it's time to reset
    if (this._isOpen && Date.now() - this.lastFailTime > this.resetTimeMs) {
      this._isOpen = false;
      this.failCount = 0;
    }
    
    return this._isOpen;
  }

  /**
   * Call when an operation fails
   */
  fail(): void {
    this.failCount++;
    this.lastFailTime = Date.now();
    
    if (this.failCount >= this.maxFailures) {
      this._isOpen = true;
    }
  }

  /**
   * Call when an operation succeeds
   */
  success(): void {
    this.failCount = 0;
  }

  /**
   * Reset this circuit breaker
   */
  reset(): void {
    this.failCount = 0;
    this._isOpen = false;
  }

  /**
   * Execute a function with circuit breaker protection
   * 
   * @param fn Function to execute
   * @param fallback Optional fallback function to call if circuit is open
   * @returns Result of the function or fallback
   */
  async execute<T>(fn: () => Promise<T>, fallback?: () => T | Promise<T>): Promise<T> {
    if (this.isOpen) {
      if (fallback) {
        return await Promise.resolve(fallback());
      }
      throw new Error(`Circuit ${this.id} is open`);
    }
    
    try {
      const result = await fn();
      this.success();
      return result;
    } catch (error) {
      this.fail();
      
      if (fallback) {
        return await Promise.resolve(fallback());
      }
      throw error;
    }
  }
}
