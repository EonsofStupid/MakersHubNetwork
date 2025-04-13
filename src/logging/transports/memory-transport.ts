
import { LogEntry, LogTransport } from '../types';
import { LogLevel } from '../constants/log-level';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * In-memory transport for storing logs
 * Useful for displaying logs in the UI
 */
class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  constructor(maxLogs?: number) {
    if (maxLogs) {
      this.maxLogs = maxLogs;
    }
  }

  log(entry: LogEntry): void {
    this.logs.unshift(entry);
    
    // Trim logs if we exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
  
  // Add getLogs method to retrieve stored logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  // Get logs filtered by level and category
  getFilteredLogs(level?: LogLevel, category?: LogCategory): LogEntry[] {
    return this.logs.filter(log => {
      const levelMatch = !level || log.level === level;
      const categoryMatch = !category || log.category === category;
      return levelMatch && categoryMatch;
    });
  }
  
  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }
}

// Export a singleton instance
export const memoryTransport = new MemoryTransport();
