
import { LogEntry, LogFilterOptions, LogTransport } from '@/logging/types';
import { nodeToSearchableString } from '@/shared/utils/render';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory log storage transport
 */
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxEntries: number;
  
  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }
  
  log(entry: LogEntry): void {
    // Ensure entry has an ID
    if (!entry.id) {
      entry.id = uuidv4();
    }
    
    this.logs.unshift(entry);
    
    // Trim logs to max capacity
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
  }
  
  getEntries(filter?: LogFilterOptions): LogEntry[] {
    if (!filter) {
      return [...this.logs];
    }
    
    return this.logs.filter(entry => {
      // Filter by level
      if (filter.level && entry.level !== filter.level) return false;
      if (filter.levels && filter.levels.length > 0 && !filter.levels.includes(entry.level)) return false;
      
      // Filter by category
      if (filter.category && entry.category !== filter.category) return false;
      if (filter.categories && filter.categories.length > 0 && !filter.categories.includes(entry.category)) return false;
      
      // Filter by source
      if (filter.source && entry.source !== filter.source) return false;
      if (filter.sources && filter.sources.length > 0 && !filter.sources.includes(entry.source || '')) return false;
      
      // Filter by date range
      if (filter.from) {
        const entryDate = entry.timestamp instanceof Date 
          ? entry.timestamp 
          : new Date(entry.timestamp);
        if (entryDate < filter.from) return false;
      }
      
      if (filter.to) {
        const entryDate = entry.timestamp instanceof Date 
          ? entry.timestamp 
          : new Date(entry.timestamp);
        if (entryDate > filter.to) return false;
      }
      
      // Filter by userId
      if (filter.userId && entry.userId !== filter.userId) return false;
      
      // Filter by sessionId
      if (filter.sessionId && entry.sessionId !== filter.sessionId) return false;
      
      // Filter by tags
      if (filter.tags && filter.tags.length > 0 && 
         (!entry.tags || !filter.tags.some(tag => entry.tags?.includes(tag)))) {
        return false;
      }
      
      // Filter by search term
      if (filter.search) {
        const searchable = nodeToSearchableString(entry.message) + 
                         nodeToSearchableString(entry.details) +
                         entry.level + entry.category + (entry.source || '');
        if (!searchable.toLowerCase().includes(filter.search.toLowerCase())) return false;
      }
      
      return true;
    }).slice(0, filter.limit || this.logs.length);
  }
  
  clear(): void {
    this.logs = [];
  }
}
