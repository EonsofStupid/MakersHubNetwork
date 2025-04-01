
import { LogEntry, LogTransport } from "../types";

/**
 * In-memory transport for storing logs and accessing them in the app
 */
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxEntries: number;

  constructor(options: { maxEntries?: number } = {}) {
    this.maxEntries = options.maxEntries || 1000;
  }

  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to the beginning for chronological order
    
    // Trim logs if we exceed max entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getFilteredLogs({
    level,
    category,
    search,
    startTime,
    endTime,
    limit
  }: {
    level?: number;
    category?: string;
    search?: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
  } = {}): LogEntry[] {
    let filtered = [...this.logs];
    
    // Filter by level (level and above)
    if (level !== undefined) {
      filtered = filtered.filter(log => log.level >= level);
    }
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }
    
    // Filter by time range
    if (startTime) {
      filtered = filtered.filter(log => log.timestamp >= startTime);
    }
    
    if (endTime) {
      filtered = filtered.filter(log => log.timestamp <= endTime);
    }
    
    // Search in message and source
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchLower) || 
        (log.source && log.source.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply limit
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }
  
  clear(): void {
    this.logs = [];
  }
}
