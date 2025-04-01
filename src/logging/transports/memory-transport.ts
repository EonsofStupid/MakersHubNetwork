
import { LogCategory, LogEntry, LogLevel, LogTransport } from "../types";

interface MemoryTransportOptions {
  maxEntries?: number;
}

/**
 * Transport for storing logs in memory (useful for UI display)
 */
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxEntries: number;
  
  constructor(options: MemoryTransportOptions = {}) {
    this.maxEntries = options.maxEntries || 1000;
  }
  
  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to beginning for newest first
    
    // Trim if exceeded max entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
  }
  
  /**
   * Get all logs, optionally filtered
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }
  
  /**
   * Get logs with basic filtering
   */
  getFilteredLogs(filters?: {
    level?: LogLevel; // Minimum level
    category?: LogCategory;
    source?: string;
    search?: string;
    limit?: number;
  }): LogEntry[] {
    let result = [...this.logs];
    
    if (filters) {
      // Filter by level (minimum level)
      if (filters.level !== undefined) {
        result = result.filter(log => log.level >= filters.level!);
      }
      
      // Filter by category
      if (filters.category) {
        result = result.filter(log => log.category === filters.category);
      }
      
      // Filter by source
      if (filters.source) {
        result = result.filter(log => log.source?.includes(filters.source!));
      }
      
      // Filter by search text
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(log => 
          log.message.toLowerCase().includes(searchLower) ||
          (log.source && log.source.toLowerCase().includes(searchLower)) ||
          log.category.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply limit
      if (filters.limit && filters.limit > 0) {
        result = result.slice(0, filters.limit);
      }
    }
    
    return result;
  }
  
  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }
  
  /**
   * Delete logs matching criteria
   */
  deleteLogs(criteria: {
    olderThan?: Date;
    category?: LogCategory;
    level?: LogLevel;
  }): number {
    const originalCount = this.logs.length;
    
    if (criteria.olderThan) {
      this.logs = this.logs.filter(log => log.timestamp >= criteria.olderThan!);
    }
    
    if (criteria.category) {
      this.logs = this.logs.filter(log => log.category !== criteria.category);
    }
    
    if (criteria.level) {
      this.logs = this.logs.filter(log => log.level !== criteria.level);
    }
    
    return originalCount - this.logs.length;
  }
}
