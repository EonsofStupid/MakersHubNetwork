
/**
 * CircuitBreaker utility to detect and prevent infinite loops
 * and protect against excessive rerenders or circular dependencies
 */
class CircuitBreaker {
  private static counters: Record<string, number> = {};
  private static limits: Record<string, number> = {};
  private static resetTimers: Record<string, NodeJS.Timeout> = {};
  private static resetIntervals: Record<string, number> = {};

  /**
   * Initialize a circuit breaker
   * @param id Unique identifier for the circuit breaker
   * @param limit Number of counts before tripping
   * @param resetInterval Time in ms before counter resets
   */
  static init(id: string, limit: number = 10, resetInterval: number = 10000): void {
    // Only initialize if not already initialized or if parameters changed
    if (!this.limits[id] || this.limits[id] !== limit || this.resetIntervals[id] !== resetInterval) {
      this.limits[id] = limit;
      this.resetIntervals[id] = resetInterval;
      this.counters[id] = 0;
      
      // Clear existing timer if any
      if (this.resetTimers[id]) {
        clearTimeout(this.resetTimers[id]);
      }
      
      // Set reset timer
      this.resetTimers[id] = setTimeout(() => {
        this.counters[id] = 0;
      }, resetInterval);
    }
  }

  /**
   * Increment counter for a circuit breaker
   * @param id Unique identifier for the circuit breaker
   * @returns Current count
   */
  static count(id: string): number {
    // Initialize if not already initialized with default values
    if (this.limits[id] === undefined) {
      this.init(id);
    }
    
    // Increment counter
    this.counters[id] = (this.counters[id] || 0) + 1;
    return this.counters[id];
  }

  /**
   * Get current count without incrementing
   * @param id Unique identifier for the circuit breaker
   * @returns Current count
   */
  static getCount(id: string): number {
    return this.counters[id] || 0;
  }

  /**
   * Check if circuit breaker is tripped
   * @param id Unique identifier for the circuit breaker
   * @returns True if circuit breaker is tripped
   */
  static isTripped(id: string): boolean {
    // If not initialized, not tripped
    if (this.limits[id] === undefined) {
      return false;
    }
    
    return (this.counters[id] || 0) >= this.limits[id];
  }

  /**
   * Reset circuit breaker
   * @param id Unique identifier for the circuit breaker
   */
  static reset(id: string): void {
    this.counters[id] = 0;
  }

  /**
   * Reset all circuit breakers
   */
  static resetAll(): void {
    Object.keys(this.counters).forEach(id => {
      this.counters[id] = 0;
    });
  }
}

export default CircuitBreaker;
