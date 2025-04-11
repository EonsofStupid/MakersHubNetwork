
import { LogEntry, LogTransport, LogCategory, LogLevel, LogFilterOptions } from '../types';
import { nodeToSearchableString } from '@/shared/utils/render';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory log transport for retrieving logs in UI components
 */
export class MemoryTransport implements LogTransport {
  private entries: LogEntry[] = [];
  private maxEntries: number;
  
  constructor(options: { maxEntries?: number } = {}) {
    this.maxEntries = options.maxEntries || 1000;
  }
  
  /**
   * Log an entry
   */
  log(entry: LogEntry): void {
    // Ensure entry has an ID
    if (!entry.id) {
      entry = { ...entry, id: uuidv4() };
    }
    
    // Add to the beginning of the array (newest first)
    this.entries.unshift(entry);
    
    // Trim if needed
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
  }
  
  /**
   * Get entries matching criteria
   */
  getEntries(options: LogFilterOptions = {}): LogEntry[] {
    let result = [...this.entries];
    
    // Filter by level
    if (options.level !== undefined) {
      result = result.filter(entry => entry.level === options.level);
    }
    
    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      result = result.filter(entry => 
        entry.category !== undefined && options.categories?.includes(entry.category)
      );
    }
    
    // Filter by source
    if (options.source) {
      result = result.filter(entry => 
        entry.source && entry.source.includes(options.source as string)
      );
    }
    
    // Filter by date range
    if (options.fromDate) {
      result = result.filter(entry => entry.timestamp >= options.fromDate!);
    }
    
    if (options.toDate) {
      result = result.filter(entry => entry.timestamp <= options.toDate!);
    }
    
    // Filter by search term
    if (options.search) {
      const term = options.search.toLowerCase();
      result = result.filter(entry => {
        // Check message
        if (typeof entry.message === 'string') {
          if (entry.message.toLowerCase().includes(term)) return true;
        } else {
          const text = nodeToSearchableString(entry.message);
          if (text.toLowerCase().includes(term)) return true;
        }
        
        // Check details
        if (entry.details) {
          try {
            const detailsStr = JSON.stringify(entry.details).toLowerCase();
            if (detailsStr.includes(term)) return true;
          } catch {
            // Ignore stringify errors
          }
        }
        
        // Check source
        if (entry.source && entry.source.toLowerCase().includes(term)) return true;
        
        return false;
      });
    }
    
    // Apply limit
    if (options.limit && options.limit > 0 && options.limit < result.length) {
      result = result.slice(0, options.limit);
    }
    
    return result;
  }
  
  /**
   * Clear entries
   */
  clear(): void {
    this.entries = [];
  }
  
  /**
   * Check if this transport supports the given log level & category
   */
  supports(level: LogLevel, category?: LogCategory): boolean {
    // Support all levels and categories
    return true;
  }
}

// Export a singleton instance for global use
export const memoryTransport = new MemoryTransport();
