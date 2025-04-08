
/**
 * CircuitBreaker - Utility to prevent infinite loops in React components
 * 
 * Usage:
 * 
 * // Initialize in component
 * CircuitBreaker.init('componentName', 10, 1000);
 * 
 * // Check before performing an operation
 * if (CircuitBreaker.count('componentName')) {
 *   console.warn('Breaking potential infinite loop');
 *   return;
 * }
 */

interface CircuitBreakerState {
  counter: number;
  threshold: number;
  timestamp: number;
  timeout: number;
  broken: boolean;
}

class CircuitBreakerImpl {
  private breakers: Map<string, CircuitBreakerState> = new Map();
  
  /**
   * Initialize a circuit breaker
   * @param id Unique identifier for this breaker
   * @param threshold Maximum number of calls allowed within timeout period
   * @param timeout Period in ms to reset counter
   */
  init(id: string, threshold: number = 20, timeout: number = 1000): void {
    if (!this.breakers.has(id)) {
      this.breakers.set(id, {
        counter: 0,
        threshold,
        timestamp: Date.now(),
        timeout,
        broken: false
      });
    }
  }
  
  /**
   * Increment counter for this breaker and check if threshold is exceeded
   * @param id Breaker identifier
   * @returns true if breaker has tripped, false otherwise
   */
  count(id: string): boolean {
    // If breaker doesn't exist, create it with defaults
    if (!this.breakers.has(id)) {
      this.init(id);
    }
    
    const breaker = this.breakers.get(id)!;
    const now = Date.now();
    
    // Reset if timeout has passed
    if (now - breaker.timestamp > breaker.timeout) {
      breaker.counter = 0;
      breaker.timestamp = now;
      breaker.broken = false;
    }
    
    // Increment counter
    breaker.counter += 1;
    
    // Check if threshold exceeded
    if (breaker.counter > breaker.threshold) {
      if (!breaker.broken) {
        console.warn(`CircuitBreaker: '${id}' exceeded threshold (${breaker.threshold}) - breaking potential infinite loop`);
        breaker.broken = true;
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Reset a circuit breaker
   * @param id Breaker identifier
   */
  reset(id: string): void {
    if (this.breakers.has(id)) {
      const breaker = this.breakers.get(id)!;
      breaker.counter = 0;
      breaker.timestamp = Date.now();
      breaker.broken = false;
    }
  }
  
  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach((breaker, id) => {
      this.reset(id);
    });
  }

  /**
   * Get the current count for a circuit breaker
   * @param id Breaker identifier
   * @returns The current count or 0 if breaker doesn't exist
   */
  getCount(id: string): number {
    if (!this.breakers.has(id)) {
      return 0;
    }
    return this.breakers.get(id)!.counter;
  }

  /**
   * Check if a circuit breaker is tripped
   * @param id Breaker identifier
   * @returns true if breaker is tripped, false otherwise
   */
  isTripped(id: string): boolean {
    if (!this.breakers.has(id)) {
      return false;
    }
    const breaker = this.breakers.get(id)!;
    return breaker.broken || breaker.counter > breaker.threshold;
  }
}

// Export singleton
const CircuitBreaker = new CircuitBreakerImpl();

export default CircuitBreaker;
