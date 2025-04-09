
/**
 * CircuitBreaker - A utility to prevent infinite loops and excessive rerenders
 */

type CircuitBreakerState = {
  count: number;
  limit: number;
  timestamp: number;
  ttl: number;
};

class CircuitBreaker {
  private static circuits: Record<string, CircuitBreakerState> = {};

  /**
   * Initialize a circuit breaker
   * @param name - Unique name for the circuit
   * @param limit - Max count before tripping
   * @param ttl - Time to live in ms
   */
  static init(name: string, limit = 10, ttl = 2000): void {
    if (!this.circuits[name]) {
      this.circuits[name] = {
        count: 0,
        limit,
        timestamp: Date.now(),
        ttl
      };
    }
  }

  /**
   * Increment count and return if circuit is tripped
   */
  static count(name: string): boolean {
    if (!this.circuits[name]) {
      this.init(name);
    }

    const circuit = this.circuits[name];
    const now = Date.now();

    // Reset if TTL expired
    if (now - circuit.timestamp > circuit.ttl) {
      circuit.count = 1;
      circuit.timestamp = now;
      return false;
    }

    // Increment and check if tripped
    circuit.count += 1;
    return circuit.count > circuit.limit;
  }

  /**
   * Check if circuit is tripped without incrementing
   */
  static isTripped(name: string): boolean {
    if (!this.circuits[name]) {
      return false;
    }

    const circuit = this.circuits[name];
    const now = Date.now();

    // Reset if TTL expired
    if (now - circuit.timestamp > circuit.ttl) {
      circuit.count = 0;
      circuit.timestamp = now;
      return false;
    }

    return circuit.count > circuit.limit;
  }

  /**
   * Reset a circuit
   */
  static reset(name: string): void {
    if (this.circuits[name]) {
      this.circuits[name].count = 0;
      this.circuits[name].timestamp = Date.now();
    }
  }

  /**
   * Get current count for a circuit
   */
  static getCount(name: string): number {
    return this.circuits[name]?.count || 0;
  }
}

export default CircuitBreaker;
