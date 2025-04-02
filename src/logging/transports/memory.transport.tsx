
import { LogEntry, LogTransport } from '../types';

/**
 * In-memory transport for storing logs in memory
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  
  constructor(maxLogs: number = 1000) {
    this.maxLogs = maxLogs;
  }
  
  log(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Trim if we exceed the max logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  clear(): void {
    this.logs = [];
  }
}

export const memoryTransport = new MemoryTransport();
