
/**
 * CircuitBreaker
 * 
 * Utility class to prevent infinite loops and unintended recursion
 * in cross-module communication and initialization sequences.
 */
export class CircuitBreaker {
  private source: string;
  private maxCount: number;
  private resetIntervalMs: number;
  private counts: Map<string, number> = new Map();
  private lastReset: number = Date.now();

  /**
   * Create a new CircuitBreaker
   * 
   * @param source The source identifier (usually component or module name)
   * @param maxCount Maximum number of calls before warning/breaking
   * @param resetIntervalMs Time in ms after which the counter resets
   */
  constructor(source: string, maxCount: number = 5, resetIntervalMs: number = 1000) {
    this.source = source;
    this.maxCount = maxCount;
    this.resetIntervalMs = resetIntervalMs;
  }

  /**
   * Count a call and check if we've exceeded the threshold
   * 
   * @param key The operation being performed
   * @returns The current count
   */
  count(key: string | number): number {
    // Check if we should reset counts based on time interval
    this.checkReset();
    
    // Get current count
    const currentKey = `${this.source}:${key}`;
    const currentCount = (this.counts.get(currentKey) || 0) + 1;
    
    // Store updated count
    this.counts.set(currentKey, currentCount);
    
    // Log warning if we've exceeded the threshold
    if (currentCount > this.maxCount) {
      console.warn(`CircuitBreaker: ${this.source} exceeded ${this.maxCount} calls for "${key}".`);
    }
    
    return currentCount;
  }

  /**
   * Check if we should reset the counts based on time interval
   */
  private checkReset(): void {
    const now = Date.now();
    if (now - this.lastReset > this.resetIntervalMs) {
      this.counts.clear();
      this.lastReset = now;
    }
  }

  /**
   * Reset all counts
   */
  reset(): void {
    this.counts.clear();
    this.lastReset = Date.now();
  }
}
