
import { LogEntry, LogLevel, LOG_LEVEL_VALUES } from '@/shared/types/shared.types';
import { Transport } from './transport.interface';

class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private maxEntries: number;
  private minLevel: LogLevel;

  constructor(maxEntries = 1000, minLevel = LogLevel.DEBUG) {
    this.maxEntries = maxEntries;
    this.minLevel = minLevel;
  }

  log(entry: LogEntry): void {
    // Only log if the level is greater than or equal to the minimum level
    if (LOG_LEVEL_VALUES[entry.level] >= LOG_LEVEL_VALUES[this.minLevel]) {
      this.logs.unshift(entry); // Add to the beginning for reverse chronological order
      
      // Trim if we exceed maxEntries
      if (this.logs.length > this.maxEntries) {
        this.logs = this.logs.slice(0, this.maxEntries);
      }
    }
  }

  async query(options?: any): Promise<LogEntry[]> {
    let result = [...this.logs];
    
    if (options) {
      // Filter by level
      if (options.level) {
        result = result.filter(log => log.level === options.level);
      }
      
      // Filter by category
      if (options.category) {
        result = result.filter(log => log.category === options.category);
      }
      
      // Filter by search term
      if (options.search) {
        const searchTerm = options.search.toLowerCase();
        result = result.filter(log => 
          log.message.toLowerCase().includes(searchTerm) || 
          (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm))
        );
      }
      
      // Filter by date range
      if (options.from) {
        result = result.filter(log => new Date(log.timestamp) >= new Date(options.from));
      }
      
      if (options.to) {
        result = result.filter(log => new Date(log.timestamp) <= new Date(options.to));
      }
    }
    
    return result;
  }

  clear(): void {
    this.logs = [];
  }
}

export const memoryTransport = new MemoryTransport();
