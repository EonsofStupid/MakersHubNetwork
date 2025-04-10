
/**
 * CircuitBreaker
 * 
 * Utility to prevent infinite loops and cascading failures
 */

export class CircuitBreaker {
  private counters: Map<string, number>;
  private lastResetTime: Map<string, number>;
  private readonly name: string;
  private readonly maxAttempts: number;
  private readonly resetIntervalMs: number;
  
  /**
   * Create a new CircuitBreaker
   * 
   * @param name Unique name for this circuit breaker instance
   * @param maxAttempts Maximum attempts before the circuit trips
   * @param resetIntervalMs Time in milliseconds before counters are reset
   */
  constructor(name: string, maxAttempts: number = 5, resetIntervalMs: number = 5000) {
    this.name = name;
    this.maxAttempts = maxAttempts;
    this.resetIntervalMs = resetIntervalMs;
    this.counters = new Map<string, number>();
    this.lastResetTime = new Map<string, number>();
  }
  
  /**
   * Count an attempt and check if the circuit should trip
   * Returns the current count
   * 
   * @param operationName Name of the operation being performed
   * @returns Current count for this operation
   */
  count(operationName: string): number {
    const key = `${this.name}:${operationName}`;
    const now = Date.now();
    
    // Check if we should reset
    const lastReset = this.lastResetTime.get(key) || 0;
    if (now - lastReset > this.resetIntervalMs) {
      this.counters.set(key, 0);
      this.lastResetTime.set(key, now);
    }
    
    // Get current count and increment
    const currentCount = (this.counters.get(key) || 0) + 1;
    this.counters.set(key, currentCount);
    
    return currentCount;
  }
  
  /**
   * Check if the circuit would trip without incrementing the counter
   * 
   * @param operationName Name of the operation being performed
   * @returns True if next count would trip the circuit
   */
  wouldTrip(operationName: string): boolean {
    const key = `${this.name}:${operationName}`;
    return (this.counters.get(key) || 0) >= this.maxAttempts;
  }
  
  /**
   * Check if the circuit is already tripped
   * 
   * @param operationName Name of the operation being performed
   * @returns True if the circuit is already tripped
   */
  isTripped(operationName: string): boolean {
    const key = `${this.name}:${operationName}`;
    return (this.counters.get(key) || 0) > this.maxAttempts;
  }
  
  /**
   * Reset all counters for this circuit breaker
   */
  reset(): void {
    this.counters.clear();
    this.lastResetTime.clear();
  }
  
  /**
   * Reset a specific operation counter
   * 
   * @param operationName Name of the operation to reset
   */
  resetOperation(operationName: string): void {
    const key = `${this.name}:${operationName}`;
    this.counters.set(key, 0);
    this.lastResetTime.set(key, Date.now());
  }
  
  /**
   * Execute a function only if the circuit is not tripped
   * 
   * @param operationName Name of the operation being performed
   * @param fn Function to execute
   * @param fallback Optional fallback value if circuit is tripped
   * @returns Result of fn or fallback
   */
  execute<T>(operationName: string, fn: () => T, fallback?: T): T {
    if (this.isTripped(operationName)) {
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error(`Circuit ${this.name} tripped for operation ${operationName}`);
    }
    
    const count = this.count(operationName);
    if (count > this.maxAttempts) {
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error(`Circuit ${this.name} tripped for operation ${operationName}`);
    }
    
    return fn();
  }
}

