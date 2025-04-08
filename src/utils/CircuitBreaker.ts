
/**
 * CircuitBreaker - Helper utility to prevent infinite loops in React rendering
 * 
 * Use this to detect and break potential infinite loops by tracking
 * the number of renders in a short time period
 */

class CircuitBreaker {
  private static counters = new Map<string, number>();
  private static timestamps = new Map<string, number>();
  private static thresholds = new Map<string, number>();
  private static timeWindows = new Map<string, number>();
  private static tripped = new Map<string, boolean>();
  private static initialized = new Set<string>();
  
  /**
   * Initialize a circuit breaker with a specific threshold
   * @param key Unique identifier for this circuit breaker
   * @param threshold Number of renders that trigger the breaker
   * @param timeWindowMs Time window in milliseconds to count renders
   */
  static init(key: string, threshold: number = 10, timeWindowMs: number = 500): void {
    // Only initialize once
    if (this.initialized.has(key)) return;
    
    this.counters.set(key, 0);
    this.timestamps.set(key, Date.now());
    this.thresholds.set(key, threshold);
    this.timeWindows.set(key, timeWindowMs);
    this.tripped.set(key, false);
    this.initialized.add(key);
    
    console.debug(`[CircuitBreaker] Initialized ${key} with threshold ${threshold} in ${timeWindowMs}ms`);
  }
  
  /**
   * Reset a circuit breaker
   * @param key Unique identifier for this circuit breaker
   */
  static reset(key: string): void {
    this.counters.set(key, 0);
    this.timestamps.set(key, Date.now());
    this.tripped.set(key, false);
    console.debug(`[CircuitBreaker] Reset ${key}`);
  }
  
  /**
   * Count a render and check if the circuit breaker has tripped
   * @param key Unique identifier for this circuit breaker
   * @returns True if the circuit breaker has tripped
   */
  static count(key: string): boolean {
    // Initialize if not already done
    if (!this.initialized.has(key)) {
      this.init(key);
    }
    
    // If already tripped, return true
    if (this.tripped.get(key)) {
      return true;
    }
    
    // Get current values
    const counter = this.counters.get(key) || 0;
    const timestamp = this.timestamps.get(key) || Date.now();
    const threshold = this.thresholds.get(key) || 10;
    const timeWindow = this.timeWindows.get(key) || 500;
    
    // Check if we're still within the time window
    const now = Date.now();
    if (now - timestamp > timeWindow) {
      // Reset if outside time window
      this.counters.set(key, 1);
      this.timestamps.set(key, now);
      return false;
    }
    
    // Increment counter
    const newCounter = counter + 1;
    this.counters.set(key, newCounter);
    
    // Check if we've exceeded the threshold
    if (newCounter > threshold) {
      console.error(`Circuit breaker tripped for ${key}: ${newCounter} renders in ${now - timestamp}ms`);
      this.tripped.set(key, true);
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if the circuit breaker has tripped
   * @param key Unique identifier for this circuit breaker
   * @returns True if the circuit breaker has tripped
   */
  static isTripped(key: string): boolean {
    return this.tripped.get(key) || false;
  }
  
  /**
   * Get the current count for a circuit breaker
   * Useful for debugging
   */
  static getCount(key: string): number {
    return this.counters.get(key) || 0;
  }
  
  /**
   * Reset all circuit breakers
   * Useful when navigating to a new page
   */
  static resetAll(): void {
    this.initialized.forEach(key => {
      this.reset(key);
    });
    console.debug(`[CircuitBreaker] Reset all circuit breakers`);
  }
}

export default CircuitBreaker;
