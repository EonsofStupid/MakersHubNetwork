
import { LogEntry, LogTransport } from '../types';

/**
 * In-memory transport for storing logs
 * Used for displaying logs in the UI
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxEntries: number;
  
  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries;
  }
  
  log(entry: LogEntry): void {
    // Ensure entry has an ID
    if (!entry.id) {
      entry.id = crypto.randomUUID ? 
        crypto.randomUUID() : 
        `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Ensure timestamp is a proper date if it's a string
    if (typeof entry.timestamp === 'string') {
      try {
        entry.timestamp = new Date(entry.timestamp).toISOString();
      } catch (e) {
        entry.timestamp = new Date().toISOString();
      }
    }
    
    this.logs.push(entry);
    
    // Trim logs if they exceed the maximum number of entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(this.logs.length - this.maxEntries);
    }
  }
  
  getLogs(): LogEntry[] {
    return this.logs;
  }
  
  clear(): void {
    this.logs = [];
  }
}

// Export a singleton instance
export const memoryTransport = new MemoryTransport();
