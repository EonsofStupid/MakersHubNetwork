
import { Transport } from './transport.interface';
import { LogEntry, LogFilter } from '@/shared/types/shared.types';
import { LOG_LEVEL_VALUES } from '@/shared/types/shared.types';

export class MemoryTransport implements Transport {
  private entries: LogEntry[] = [];
  private maxEntries: number = 1000;
  
  constructor(maxEntries?: number) {
    if (maxEntries) {
      this.maxEntries = maxEntries;
    }
  }
  
  log(entry: LogEntry): void {
    this.entries.unshift(entry);
    
    // Trim entries if we exceed max size
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
  }
  
  async query(filter?: LogFilter): Promise<LogEntry[]> {
    if (!filter) return [...this.entries];
    
    return this.entries.filter(entry => {
      // Filter by level
      if (filter.level && LOG_LEVEL_VALUES[entry.level] < LOG_LEVEL_VALUES[filter.level]) {
        return false;
      }
      
      // Filter by category
      if (filter.category && entry.category !== filter.category) {
        return false;
      }
      
      // Filter by search term
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        if (!entry.message.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }
      
      // Filter by time range
      if (filter.startTime && entry.timestamp < filter.startTime.getTime()) {
        return false;
      }
      
      if (filter.endTime && entry.timestamp > filter.endTime.getTime()) {
        return false;
      }
      
      // Filter by source
      if (filter.source && entry.source !== filter.source) {
        return false;
      }
      
      return true;
    });
  }
  
  clear(): void {
    this.entries = [];
  }
  
  getEntries(): LogEntry[] {
    return [...this.entries];
  }
}

// Export a singleton instance
export const memoryTransport = new MemoryTransport();
