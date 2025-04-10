
/**
 * CircuitBreaker - A utility to prevent infinite loops and recursion
 * Used by various components to prevent excessive re-renders and API calls
 */

interface BreakerState {
  count: number;
  maxCount: number;
  resetTime: number;
  lastTripped: number;
  isOpen: boolean;
}

class CircuitBreakerImpl {
  private breakers: Map<string, BreakerState> = new Map();
  
  /**
   * Initialize a circuit breaker
   * @param id Unique identifier for this breaker
   * @param maxCount Maximum count before tripping (default 5)
   * @param resetTimeMs Time in ms before auto-resetting (default 5000ms)
   */
  init(id: string, maxCount: number = 5, resetTimeMs: number = 5000): void {
    if (!this.breakers.has(id)) {
      this.breakers.set(id, {
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
  isTripped(id: string): boolean {
    const breaker = this.breakers.get(id);
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
  count(id: string, amount: number = 1): number {
    const breaker = this.breakers.get(id);
    if (!breaker) {
      this.init(id);
      return this.count(id, amount);
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
  getCount(id: string): number {
    return this.breakers.get(id)?.count || 0;
  }
  
  /**
   * Reset this breaker
   * @param id Unique identifier
   */
  reset(id: string): void {
    const breaker = this.breakers.get(id);
    if (breaker) {
      breaker.count = 0;
      breaker.isOpen = false;
    }
  }
  
  /**
   * Record a successful operation - reduces count
   * @param id Unique identifier
   */
  recordSuccess(id: string): void {
    const breaker = this.breakers.get(id);
    if (breaker && breaker.count > 0) {
      // Gradually decrease count on successful operations
      breaker.count = Math.max(0, breaker.count - 0.5);
    }
  }
  
  /**
   * Record a failure - increases count
   * @param id Unique identifier
   */
  recordFailure(id: string): void {
    this.count(id);
  }
}

// Create the singleton instance
const CircuitBreaker = new CircuitBreakerImpl();

// Add static methods for backward compatibility
(CircuitBreaker as any).init = (id: string, maxCount: number = 5, resetTimeMs: number = 5000): void => {
  CircuitBreaker.init(id, maxCount, resetTimeMs);
};

(CircuitBreaker as any).count = (id: string, amount: number = 1): number => {
  return CircuitBreaker.count(id, amount);
};

// Export as singleton
export { CircuitBreaker };
export default CircuitBreaker;
