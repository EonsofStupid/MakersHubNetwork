
import { LogEntry, LogLevel } from '@/shared/types/shared.types';
import { Transport } from './transport.interface';
import { TransportOptions } from '../types';

export class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private minLevel: LogLevel;
  private maxEntries: number;
  
  constructor(options?: TransportOptions | LogLevel) {
    if (typeof options === 'object') {
      this.minLevel = options.minLevel || LogLevel.INFO;
      this.maxEntries = options.maxEntries || 1000;
    } else {
      this.minLevel = options || LogLevel.INFO;
      this.maxEntries = 1000;
    }
  }
  
  log(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to the beginning for most recent first
    
    // Trim the logs if we exceed the max entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  getMinLevel(): LogLevel {
    return this.minLevel;
  }
  
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  clear(): void {
    this.logs = [];
  }
  
  getLog(id: string): LogEntry | undefined {
    return this.logs.find(log => log.id === id);
  }
  
  getFilteredLogs(filter: {
    level?: LogLevel;
    search?: string;
    category?: string;
    from?: Date;
    to?: Date;
  }): LogEntry[] {
    return this.logs.filter(log => {
      if (filter.level && log.level !== filter.level) {
        return false;
      }
      
      if (filter.category && log.category !== filter.category) {
        return false;
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesMessage = log.message.toLowerCase().includes(searchLower);
        const matchesSource = log.source.toLowerCase().includes(searchLower);
        if (!matchesMessage && !matchesSource) {
          return false;
        }
      }
      
      if (filter.from || filter.to) {
        const logDate = new Date(log.timestamp);
        
        if (filter.from && logDate < filter.from) {
          return false;
        }
        
        if (filter.to && logDate > filter.to) {
          return false;
        }
      }
      
      return true;
    });
  }
}

// Export a singleton instance
export const memoryTransport = new MemoryTransport();
