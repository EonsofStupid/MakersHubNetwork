
import { LogEntry, LogFilter } from '@/shared/types/shared.types';
import { isLogLevelAtLeast } from '../utils/map-log-level';

/**
 * In-memory log storage for UI display and analysis
 */
export class MemoryTransport {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  private listeners: Array<() => void> = [];

  constructor(maxLogs = 1000) {
    this.maxLogs = maxLogs;
  }

  log(entry: LogEntry): void {
    // Add to the beginning for most recent first
    this.logs.unshift(entry);
    
    // Trim if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Notify listeners
    this.notifyListeners();
  }

  clear(): void {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by criteria
   */
  getFilteredLogs(filter: LogFilter): LogEntry[] {
    return this.logs.filter(log => {
      // Filter by level (matches level or higher severity)
      if (filter.level && !isLogLevelAtLeast(log.level, filter.level)) {
        return false;
      }
      
      // Filter by category
      if (filter.category && log.category !== filter.category) {
        return false;
      }
      
      // Filter by source
      if (filter.source && log.source !== filter.source) {
        return false;
      }
      
      // Filter by text search
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const messageText = typeof log.message === 'string' 
          ? log.message.toLowerCase() 
          : JSON.stringify(log.message).toLowerCase();
        
        if (!messageText.includes(searchLower) && 
            !log.source.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Filter by user ID
      if (filter.userId && log.details && log.details.userId !== filter.userId) {
        return false;
      }
      
      // Filter by time range
      if (filter.startTime && log.timestamp < filter.startTime) {
        return false;
      }
      
      if (filter.endTime && log.timestamp > filter.endTime) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Subscribe to changes in the log store
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Create singleton instance
export const memoryTransport = new MemoryTransport();
