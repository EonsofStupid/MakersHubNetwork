
/**
 * Enhanced circuit breaker for preventing infinite loops and rendering issues
 * Works by counting calls to a named circuit and tripping after a threshold
 * Includes additional safety features to prevent common React render loop issues
 */
class CircuitBreaker {
  private static instances: Record<string, { 
    count: number;
    limit: number;
    resetTime: number;
    lastReset: number;
    tripped: boolean;
    consecutiveTrips: number;
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
        tripped: false,
        consecutiveTrips: 0
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
      
      // Only reset tripped state if we haven't had too many consecutive trips
      if (instance.tripped && instance.consecutiveTrips < 3) {
        instance.tripped = false;
        instance.consecutiveTrips = 0;
      }
    }

    // Increment counter
    instance.count++;

    // Trip the circuit if we hit the limit
    if (instance.count >= instance.limit) {
      instance.tripped = true;
      instance.consecutiveTrips++;
      
      // Log only on the first trip to avoid console flooding
      if (instance.consecutiveTrips === 1) {
        console.warn(`Circuit breaker [${name}] tripped: reached limit of ${instance.limit} calls. This indicates a potential infinite loop.`);
      }
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
    
    // Check if it's time to reset - but only if we haven't had too many consecutive trips
    if (Date.now() - instance.lastReset > instance.resetTime && instance.consecutiveTrips < 3) {
      instance.count = 0;
      instance.lastReset = Date.now();
      instance.tripped = false;
    }
    
    return instance.tripped;
  }

  /**
   * Force trip a circuit
   * @param name Circuit name
   */
  public static forceTrip(name: string): void {
    if (!this.instances[name]) {
      this.init(name);
    }
    
    this.instances[name].tripped = true;
    this.instances[name].consecutiveTrips++;
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
      this.instances[name].consecutiveTrips = 0;
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
  
  /**
   * Get the consecutive trips count
   * @param name Circuit name
   * @returns Number of consecutive trips
   */
  public static getConsecutiveTrips(name: string): number {
    return this.instances[name]?.consecutiveTrips || 0;
  }
  
  /**
   * Check if a circuit exists
   * @param name Circuit name
   * @returns True if the circuit exists
   */
  public static exists(name: string): boolean {
    return !!this.instances[name];
  }
}

export default CircuitBreaker;
