
import { LogEntry, LogLevel, LOG_LEVEL_VALUES } from '@/shared/types/shared.types';
import { Transport } from './transport.interface';

/**
 * In-memory transport for storing logs, useful for debugging
 * and displaying logs in the UI
 */
class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private minLevel: LogLevel = LogLevel.DEBUG;

  constructor(maxLogs: number = 1000, minLevel: LogLevel = LogLevel.DEBUG) {
    this.maxLogs = maxLogs;
    this.minLevel = minLevel;
  }

  /**
   * Set the minimum log level to capture
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Get the current minimum log level
   */
  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  /**
   * Log an entry to memory
   */
  log(entry: LogEntry): void {
    if (LOG_LEVEL_VALUES[entry.level] < LOG_LEVEL_VALUES[this.minLevel]) {
      return;
    }
    
    // Add to beginning for most recent first
    this.logs.unshift(entry);
    
    // Trim if exceeding the max logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get logs filtered by criteria
   */
  getFilteredLogs(filter: { 
    level?: LogLevel, 
    category?: string, 
    search?: string 
  }): LogEntry[] {
    return this.logs.filter(log => {
      // Filter by level
      if (filter.level && log.level !== filter.level) {
        return false;
      }

      // Filter by category
      if (filter.category && log.category !== filter.category) {
        return false;
      }

      // Search in message
      if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get logs by specific category
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }
}

// Export a singleton instance
export const memoryTransport = new MemoryTransport();

// Export for type usage
export type { MemoryTransport };
