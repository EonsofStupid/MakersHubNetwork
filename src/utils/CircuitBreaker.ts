
/**
 * CircuitBreaker - A simple circuit breaker implementation to prevent 
 * repeated calls to a failing resource
 */
export class CircuitBreaker {
  private name: string;
  private maxFailures: number;
  private resetTimeout: number;
  private failureCount: number = 0;
  private lastFailureTime: number | null = null;
  private isOpen: boolean = false;

  /**
   * Creates a new CircuitBreaker
   * 
   * @param name Name of the circuit for identification
   * @param maxFailures Number of failures before opening the circuit
   * @param resetTimeout Time in ms before resetting the circuit
   */
  constructor(name: string, maxFailures = 3, resetTimeout = 5000) {
    this.name = name;
    this.maxFailures = maxFailures;
    this.resetTimeout = resetTimeout;
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
    this.lastFailureTime = null;
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
   * Check if the circuit is currently open
   */
  isCircuitOpen(): boolean {
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
