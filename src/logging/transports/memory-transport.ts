
import { LogCategory, LogEntry, LogLevel, LogTransport } from '../types';

/**
 * Options for filtering logs in memory transport
 */
interface LogFilterOptions {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  userId?: string;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}

/**
 * Memory transport stores logs in memory for display in UI components
 */
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxEntries: number;
  
  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }
  
  /**
   * Log an entry to memory
   */
  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to beginning for most recent first
    
    // Trim if we exceed max entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
  }
  
  /**
   * Get all logs in memory
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Get logs filtered by specified criteria
   */
  getFilteredLogs(options: LogFilterOptions = {}): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    // Filter by level
    if (options.level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= options.level!);
    }
    
    // Filter by category
    if (options.category) {
      filteredLogs = filteredLogs.filter(log => log.category === options.category);
    }
    
    // Filter by source
    if (options.source) {
      filteredLogs = filteredLogs.filter(log => 
        log.source && log.source.includes(options.source!)
      );
    }
    
    // Filter by user ID
    if (options.userId) {
      filteredLogs = filteredLogs.filter(log => 
        log.userId && log.userId === options.userId
      );
    }
    
    // Filter by search text
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchLower) || 
        (log.source && log.source.toLowerCase().includes(searchLower)) ||
        log.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by date range
    if (options.fromDate) {
      filteredLogs = filteredLogs.filter(log => 
        log.timestamp >= options.fromDate!
      );
    }
    
    if (options.toDate) {
      filteredLogs = filteredLogs.filter(log => 
        log.timestamp <= options.toDate!
      );
    }
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      filteredLogs = filteredLogs.slice(0, options.limit);
    }
    
    return filteredLogs;
  }
  
  /**
   * Clear all logs from memory
   */
  clear(): void {
    this.logs = [];
  }
}

// Create singleton instance
export const memoryTransport = new MemoryTransport();
