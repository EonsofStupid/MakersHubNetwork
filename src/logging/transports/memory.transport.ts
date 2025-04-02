
import { LogEntry, LogTransport } from '../types';

/**
 * Maximum number of logs to store in memory
 */
const MAX_MEMORY_LOGS = 1000;

/**
 * Transport that stores logs in memory for display in UI
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  
  /**
   * Log an entry to memory
   */
  public log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to start for newest first
    
    // Limit size to prevent memory issues
    if (this.logs.length > MAX_MEMORY_LOGS) {
      this.logs = this.logs.slice(0, MAX_MEMORY_LOGS);
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
   * No-op flush implementation (required by interface)
   */
  public async flush(): Promise<void> {
    // Memory transport doesn't need to flush
    return Promise.resolve();
  }
}

// Export singleton instance
export const memoryTransport = new MemoryTransport();
