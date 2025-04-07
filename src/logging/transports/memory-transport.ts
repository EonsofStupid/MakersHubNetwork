
import { v4 as uuidv4 } from 'uuid';
import { LogEntry, LogCategory, LogLevel } from '../types';
import { nodeToSearchableString } from '@/shared/utils/render';

/**
 * Transport that keeps logs in memory for real-time display in UI components
 */
export class MemoryTransport {
  private logs: LogEntry[] = [];
  private maxSize: number;
  private searchIndex: Map<string, string> = new Map();

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Add a log entry to memory storage
   */
  log(entry: LogEntry): void {
    // Ensure entry has an ID
    if (!entry.id) {
      entry.id = uuidv4();
    }

    // Add to logs array
    this.logs.push(entry);
    
    // Build search index for this entry
    this.indexLogForSearch(entry);
    
    // Trim logs if they exceed the max size
    if (this.logs.length > this.maxSize) {
      const removedLogs = this.logs.splice(0, this.logs.length - this.maxSize);
      
      // Clean up search index for removed logs
      removedLogs.forEach(log => {
        this.searchIndex.delete(log.id);
      });
    }
  }

  /**
   * Get all log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level and category
   */
  getFilteredLogs(options: {
    level?: LogLevel,
    category?: LogCategory | LogCategory[],
    search?: string,
    limit?: number
  } = {}): LogEntry[] {
    let filtered = [...this.logs];
    
    // Filter by level if specified
    if (options.level !== undefined) {
      filtered = filtered.filter(log => log.level >= options.level!);
    }
    
    // Filter by category if specified
    if (options.category) {
      if (Array.isArray(options.category)) {
        filtered = filtered.filter(log => 
          log.category && options.category!.includes(log.category as LogCategory)
        );
      } else {
        filtered = filtered.filter(log => 
          log.category === options.category
        );
      }
    }
    
    // Filter by search text if specified
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(log => {
        // Check if this log matches the search text
        const searchableText = this.searchIndex.get(log.id) || '';
        return searchableText.includes(searchLower);
      });
    }
    
    // Apply limit if specified
    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(-options.limit);
    }
    
    return filtered;
  }
  
  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
    this.searchIndex.clear();
  }
  
  /**
   * Build search index entry for a log
   */
  private indexLogForSearch(log: LogEntry): void {
    try {
      const searchableStrings: string[] = [];
      
      // Include message as searchable text
      searchableStrings.push(nodeToSearchableString(log.message).toLowerCase());
      
      // Include level
      searchableStrings.push(String(log.level).toLowerCase());
      
      // Include category if present
      if (log.category) {
        searchableStrings.push(String(log.category).toLowerCase());
      }
      
      // Include source if present
      if (log.source) {
        searchableStrings.push(String(log.source).toLowerCase());
      }
      
      // Include details as searchable text if present
      if (log.details) {
        searchableStrings.push(nodeToSearchableString(log.details).toLowerCase());
      }
      
      // Include tags if present
      if (log.tags && log.tags.length > 0) {
        searchableStrings.push(log.tags.join(' ').toLowerCase());
      }
      
      // Set the combined searchable text in the index
      this.searchIndex.set(log.id, searchableStrings.join(' '));
    } catch (error) {
      console.error('Error indexing log for search:', error);
    }
  }
}

// Create a singleton memory transport instance
export const memoryTransport = new MemoryTransport();

