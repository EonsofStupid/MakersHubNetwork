
import { Transport } from './transport';
import { LogEntry, LogLevel } from '../types';
import { nodeToSearchableString } from '@/shared/rendering';

/**
 * Transport that keeps logs in memory for internal use
 */
export class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private maxLogs: number;

  constructor({ maxLogs = 1000 }: { maxLogs?: number } = {}) {
    this.maxLogs = maxLogs;
  }

  log(entry: LogEntry): void {
    // Add log to array
    this.logs.push(entry);
    
    // Trim logs if they exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(this.logs.length - this.maxLogs);
    }
    
    // Make logs searchable for easier filtering
    this.makeSearchable(entry);
  }
  
  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Get filtered logs
   */
  getFilteredLogs({ 
    level, 
    category, 
    source,
    search,
    limit = this.maxLogs 
  }: {
    level?: LogLevel;
    category?: string;
    source?: string;
    search?: string;
    limit?: number;
  } = {}): LogEntry[] {
    let filtered = [...this.logs];
    
    if (level !== undefined) {
      filtered = filtered.filter(log => log.level === level);
    }
    
    if (category !== undefined) {
      filtered = filtered.filter(log => log.category === category);
    }
    
    if (source !== undefined) {
      filtered = filtered.filter(log => log.source === source);
    }
    
    if (search !== undefined && search.trim() !== '') {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(log => {
        const searchableMessage = log.searchableMessage || '';
        const searchableDetails = log.searchableDetails || '';
        
        return (
          searchableMessage.toLowerCase().includes(searchTerm) ||
          searchableDetails.toLowerCase().includes(searchTerm) ||
          (log.source || '').toLowerCase().includes(searchTerm) ||
          (log.category || '').toLowerCase().includes(searchTerm)
        );
      });
    }
    
    return filtered.slice(0, limit);
  }
  
  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }
  
  /**
   * Add searchable properties to log entry
   */
  private makeSearchable(entry: LogEntry): void {
    // Convert message to searchable string
    entry.searchableMessage = nodeToSearchableString(entry.message);
    
    // Convert details to searchable string if they exist
    if (entry.details) {
      try {
        entry.searchableDetails = nodeToSearchableString(entry.details);
      } catch (e) {
        entry.searchableDetails = '[Error converting details to searchable string]';
      }
    }
  }
}
