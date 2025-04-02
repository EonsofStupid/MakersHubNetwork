
import { LogEntry, LogTransport } from '../types';

/**
 * Transport that stores logs in memory
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxSize: number = 1000;

  /**
   * Store a log entry in memory
   */
  public log(entry: LogEntry): void {
    this.logs.unshift(entry);
    
    // Trim if exceeds max size
    if (this.logs.length > this.maxSize) {
      this.logs = this.logs.slice(0, this.maxSize);
    }
  }

  /**
   * Get all stored logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all stored logs
   */
  public clear(): void {
    this.logs = [];
  }

  /**
   * Set the maximum number of logs to store
   */
  public setMaxSize(size: number): void {
    this.maxSize = size;
    
    // Trim if already exceeds new max size
    if (this.logs.length > this.maxSize) {
      this.logs = this.logs.slice(0, this.maxSize);
    }
  }

  /**
   * Flush implementation (no-op for memory)
   */
  public async flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Export singleton instance
export const memoryTransport = new MemoryTransport();
