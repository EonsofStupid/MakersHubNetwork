/**
 * Circuit Breaker implementation to prevent cascading failures
 */
export class CircuitBreaker {
  // Make properties public instead of private
  public isOpen: boolean = false;
  public failureCount: number = 0;
  public successCount: number = 0;
  public lastFailureTime: number = 0;
  public count: number = 0;
  
  constructor(
    public name: string,
    public maxFailures: number = 5,
    public resetTimeout: number = 30000,
    public halfOpenAttemptsAllowed: number = 1,
  ) {}

  // Static factory method for convenience
  static init(name: string, options?: Partial<{
    maxFailures: number;
    resetTimeout: number;
    halfOpenAttemptsAllowed: number;
  }>): CircuitBreaker {
    const { maxFailures, resetTimeout, halfOpenAttemptsAllowed } = options || {};
    return new CircuitBreaker(
      name,
      maxFailures,
      resetTimeout,
      halfOpenAttemptsAllowed
    );
  }

  /**
   * Executes a function with circuit breaker protection
   * 
   * @param fn The function to execute
   * @param fallback Optional fallback function to call if circuit is open
   * @returns The result of the function or fallback
   */
  async execute<T>(
    fn: () => Promise<T>, 
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.isOpen) {
      // Check if we should allow a test request
      const now = Date.now();
      if (this.lastFailureTime && (now - this.lastFailureTime) > this.resetTimeout) {
        // Try to reset the circuit with a test request
        this.isOpen = false;
      } else if (fallback) {
        // Circuit is still open, use fallback
        return fallback();
      } else {
        // Circuit is open with no fallback
        throw new Error(`Circuit [${this.name}] is open`);
      }
    }

    // Execute the function
    try {
      const result = await fn();
      // Success, reset failure count
      this.reset();
      return result;
    } catch (error) {
      // Handle failure
      this.recordFailure();
      
      // Check if we've hit the threshold and open the circuit
      if (this.failureCount >= this.maxFailures) {
        this.isOpen = true;
        this.lastFailureTime = Date.now();
      }
      
      // Use fallback if available
      if (fallback) {
        return fallback();
      }
      
      // No fallback, re-throw the error
      throw error;
    }
  }
  
  /**
   * Reset the circuit breaker
   */
  reset(): void {
    this.failureCount = 0;
    this.isOpen = false;
    this.lastFailureTime = 0;
    this.count = 0;
  }
  
  /**
   * Record a failure and increment the count
   */
  recordFailure(): void {
    this.failureCount++;
  }
  
  /**
   * Get the current failure count
   */
  getFailureCount(): number {
    return this.failureCount;
  }
  
  /**
   * Get the current success count
   */
  getSuccessCount(): number {
    return this.successCount;
  }
  
  /**
   * Get the current count
   */
  getCount(): number {
    return this.count;
  }
  
  /**
   * Check if the circuit is currently open
   */
  getIsOpen(): boolean {
    // If circuit was open, check if it's time to reset
    if (this.isOpen && this.lastFailureTime) {
      const now = Date.now();
      if ((now - this.lastFailureTime) > this.resetTimeout) {
        this.isOpen = false;
      }
    }
    return this.isOpen;
  }
}
