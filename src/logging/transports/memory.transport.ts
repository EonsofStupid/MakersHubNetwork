
import { LogEntry, LogTransport } from "../types";

/**
 * In-memory transport for logs
 * Stores logs in memory for access by the UI
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  
  constructor(maxLogs?: number) {
    if (maxLogs) {
      this.maxLogs = maxLogs;
    }
  }
  
  /**
   * Log an entry
   */
  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to the front for newest first
    
    // Trim if we exceed the max logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
  
  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Get log count
   */
  getLogCount(): number {
    return this.logs.length;
  }
  
  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }
  
  /**
   * No-op flush as memory transport doesn't need flushing
   */
  flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Export a singleton instance
export const memoryTransport = new MemoryTransport();
