
import { LogEntry, LogTransport } from '../types';

/**
 * Maximum number of log entries to store in memory
 */
const MAX_MEMORY_LOGS = 1000;

/**
 * Transport that stores logs in memory for later retrieval
 */
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  
  /**
   * Log an entry to memory storage
   */
  public log(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Trim logs if they exceed maximum
    if (this.logs.length > MAX_MEMORY_LOGS) {
      this.logs = this.logs.slice(-MAX_MEMORY_LOGS);
    }
  }
  
  /**
   * Retrieve all stored logs
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
   * Flush implementation (no-op for memory)
   */
  public async flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Export singleton instance
export const memoryTransport = new MemoryTransport();
