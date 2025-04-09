
/**
 * Circuit Breaker utility to prevent infinite loops and excessive renders
 */
class CircuitBreaker {
  private static instances: Record<string, { count: number; threshold: number; resetTimeout?: NodeJS.Timeout; resetTime: number }> = {};

  /**
   * Initialize a circuit breaker for a specific key
   * @param key Unique identifier for this circuit breaker
   * @param threshold Maximum number of calls before tripping
   * @param resetTime Time in ms after which to reset the counter
   */
  static init(key: string, threshold: number = 10, resetTime: number = 5000): void {
    if (!this.instances[key]) {
      this.instances[key] = {
        count: 0,
        threshold,
        resetTime
      };
    }
  }

  /**
   * Increment the counter for a specific key
   * @param key Unique identifier for this circuit breaker
   * @returns True if the circuit is not tripped, false if it is
   */
  static count(key: string): boolean {
    if (!this.instances[key]) {
      this.init(key);
    }

    const instance = this.instances[key];
    instance.count += 1;

    // Set up auto-reset if not already set
    if (!instance.resetTimeout) {
      instance.resetTimeout = setTimeout(() => {
        this.reset(key);
      }, instance.resetTime);
    }

    return !this.isTripped(key);
  }

  /**
   * Check if the circuit breaker has tripped
   * @param key Unique identifier for this circuit breaker
   * @returns True if the circuit has tripped (exceeded threshold)
   */
  static isTripped(key: string): boolean {
    if (!this.instances[key]) {
      return false;
    }
    return this.instances[key].count >= this.instances[key].threshold;
  }

  /**
   * Reset the counter for a specific key
   * @param key Unique identifier for this circuit breaker
   */
  static reset(key: string): void {
    if (this.instances[key]) {
      if (this.instances[key].resetTimeout) {
        clearTimeout(this.instances[key].resetTimeout);
      }
      this.instances[key].count = 0;
      this.instances[key].resetTimeout = undefined;
    }
  }

  /**
   * Reset all circuit breakers
   */
  static resetAll(): void {
    Object.keys(this.instances).forEach(key => this.reset(key));
  }

  /**
   * Get the current count for a specific key
   * @param key Unique identifier for this circuit breaker
   * @returns Current count
   */
  static getCount(key: string): number {
    if (!this.instances[key]) {
      return 0;
    }
    return this.instances[key].count;
  }
}

export default CircuitBreaker;
