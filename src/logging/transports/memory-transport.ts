
import { LogEntry, LogTransport, LogCategory, LogLevel } from '../types';

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
   * Get filtered logs based on criteria
   */
  getFilteredLogs(options?: {
    level?: LogLevel;
    category?: LogCategory;
    search?: string;
    limit?: number;
    tags?: string[];
    fromDate?: Date;
    toDate?: Date;
  }): LogEntry[] {
    let filtered = [...this.logs];
    
    if (!options) {
      return filtered;
    }
    
    // Filter by level
    if (options.level !== undefined) {
      filtered = filtered.filter(log => log.level >= options.level!);
    }
    
    // Filter by category
    if (options.category) {
      filtered = filtered.filter(log => log.category === options.category);
    }
    
    // Filter by search text
    if (options.search) {
      const query = options.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) || 
        (log.source && log.source.toLowerCase().includes(query)) ||
        log.category.toLowerCase().includes(query) ||
        (typeof log.details === 'string' && log.details.toLowerCase().includes(query))
      );
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(log => 
        log.tags && options.tags!.some(tag => log.tags!.includes(tag))
      );
    }
    
    // Filter by date range
    if (options.fromDate) {
      filtered = filtered.filter(log => log.timestamp >= options.fromDate!);
    }
    
    if (options.toDate) {
      filtered = filtered.filter(log => log.timestamp <= options.toDate!);
    }
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }
    
    return filtered;
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
