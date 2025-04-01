
import { LogEntry, LogTransport } from '../types';

/**
 * Transport for in-memory log storage for UI components
 */
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  
  constructor(maxLogs: number = 1000) {
    this.maxLogs = maxLogs;
  }
  
  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to beginning so newest is first
    
    // Trim if over max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
  
  /**
   * Get all logs in reverse chronological order (newest first)
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }
  
  /**
   * Get logs by level
   */
  getLogsByLevel(level: number): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
  
  /**
   * Get logs by category
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }
  
  /**
   * Get count of logs
   */
  getCount(): number {
    return this.logs.length;
  }
}

// Create a singleton instance
export const memoryTransport = new MemoryTransport();
