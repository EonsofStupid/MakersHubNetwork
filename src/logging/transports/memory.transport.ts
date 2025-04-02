
import { LogEntry, LogTransport } from '../types';

/**
 * In-memory transport for storing logs
 * This is useful for displaying logs in the admin panel
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  
  constructor(maxLogs: number = 1000) {
    this.maxLogs = maxLogs;
  }
  
  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to beginning for newest first
    
    // Trim if exceeds max logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs]; // Return copy to prevent external modification
  }
  
  clearLogs(): void {
    this.logs = [];
  }
  
  getLogCount(): number {
    return this.logs.length;
  }
  
  flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Create singleton instance
export const memoryTransport = new MemoryTransport();
