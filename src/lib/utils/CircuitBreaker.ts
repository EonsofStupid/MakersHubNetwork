
/**
 * Simple circuit breaker for preventing infinite loops and rendering issues
 * Works by counting calls to a named circuit and tripping after a threshold
 */
class CircuitBreaker {
  private static instances: Record<string, { 
    count: number;
    limit: number;
    resetTime: number;
    lastReset: number;
    tripped: boolean 
  }> = {};

  /**
   * Initialize a circuit breaker
   * @param name Unique name for this circuit
   * @param limit Maximum calls before circuit trips
   * @param resetTime Time in ms before circuit resets count
   */
  public static init(name: string, limit = 10, resetTime = 5000): void {
    if (!this.instances[name]) {
      this.instances[name] = {
        count: 0,
        limit,
        resetTime,
        lastReset: Date.now(),
        tripped: false
      };
    }
  }

  /**
   * Increment the counter for the named circuit
   * @param name Circuit name
   * @returns Current count
   */
  public static count(name: string): number {
    // Initialize with defaults if not exists
    if (!this.instances[name]) {
      this.init(name);
    }

    const instance = this.instances[name];
    
    // Check if it's time to reset
    if (Date.now() - instance.lastReset > instance.resetTime) {
      instance.count = 0;
      instance.lastReset = Date.now();
      instance.tripped = false;
    }

    // Increment counter
    instance.count++;

    // Trip the circuit if we hit the limit
    if (instance.count >= instance.limit) {
      instance.tripped = true;
      console.warn(`Circuit breaker [${name}] tripped: reached limit of ${instance.limit} calls`);
    }

    return instance.count;
  }

  /**
   * Check if the circuit has been tripped
   * @param name Circuit name
   * @returns True if tripped, false otherwise
   */
  public static isTripped(name: string): boolean {
    if (!this.instances[name]) {
      return false;
    }

    const instance = this.instances[name];
    
    // Check if it's time to reset
    if (Date.now() - instance.lastReset > instance.resetTime) {
      instance.count = 0;
      instance.lastReset = Date.now();
      instance.tripped = false;
    }
    
    return instance.tripped;
  }

  /**
   * Reset a specific circuit
   * @param name Circuit name
   */
  public static reset(name: string): void {
    if (this.instances[name]) {
      this.instances[name].count = 0;
      this.instances[name].lastReset = Date.now();
      this.instances[name].tripped = false;
    }
  }

  /**
   * Reset all circuits
   */
  public static resetAll(): void {
    Object.keys(this.instances).forEach(name => {
      this.reset(name);
    });
  }

  /**
   * Get the current count for a circuit
   * @param name Circuit name
   * @returns Current count or 0 if circuit doesn't exist
   */
  public static getCount(name: string): number {
    return this.instances[name]?.count || 0;
  }
}

export default CircuitBreaker;
