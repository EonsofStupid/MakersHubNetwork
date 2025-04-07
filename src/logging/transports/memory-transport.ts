
import { LogEntry, Transport } from '../types';
import { nodeToSearchableString } from '@/shared/rendering';

/**
 * Memory transport that stores log entries in memory
 */
export class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private subscribers: ((logs: LogEntry[]) => void)[] = [];
  private options: { maxLogs?: number } = { maxLogs: 1000 };
  
  constructor(options: { maxLogs?: number } = {}) {
    this.options = { ...this.options, ...options };
  }
  
  log(entry: LogEntry): void {
    // Store searchable versions of message and details
    const entryWithSearch = {
      ...entry,
      searchableMessage: nodeToSearchableString(entry.message),
      searchableDetails: entry.details ? JSON.stringify(entry.details) : undefined
    };
    
    // Add to logs
    this.logs.unshift(entryWithSearch as LogEntry);
    
    // Limit size
    if (this.options.maxLogs && this.logs.length > this.options.maxLogs) {
      this.logs = this.logs.slice(0, this.options.maxLogs);
    }
    
    // Notify subscribers
    this.notifySubscribers();
  }
  
  getLogs(): LogEntry[] {
    return this.logs;
  }
  
  getFilteredLogs(options: {
    search?: string;
    level?: string;
    category?: string;
    source?: string;
    startTime?: Date;
    endTime?: Date;
  } = {}): LogEntry[] {
    let filtered = [...this.logs];
    
    // Filter by level
    if (options.level) {
      filtered = filtered.filter(log => log.level === options.level);
    }
    
    // Filter by category
    if (options.category) {
      filtered = filtered.filter(log => log.category === options.category);
    }
    
    // Filter by source
    if (options.source) {
      filtered = filtered.filter(log => log.source === options.source);
    }
    
    // Filter by time range
    if (options.startTime) {
      filtered = filtered.filter(log => 
        log.timestamp instanceof Date 
          ? log.timestamp >= options.startTime! 
          : new Date(log.timestamp) >= options.startTime!
      );
    }
    
    if (options.endTime) {
      filtered = filtered.filter(log => 
        log.timestamp instanceof Date 
          ? log.timestamp <= options.endTime! 
          : new Date(log.timestamp) <= options.endTime!
      );
    }
    
    // Filter by search term
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(log => {
        // Search in message
        const searchableMessage = (log as any).searchableMessage || 
          nodeToSearchableString(log.message);
        
        if (searchableMessage.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in details
        if (log.details) {
          const searchableDetails = (log as any).searchableDetails || 
            JSON.stringify(log.details);
          
          if (searchableDetails.toLowerCase().includes(searchLower)) {
            return true;
          }
        }
        
        return false;
      });
    }
    
    return filtered;
  }
  
  clear(): void {
    this.logs = [];
    this.notifySubscribers();
  }
  
  subscribe(callback: (logs: LogEntry[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.logs));
  }
}

// Create a singleton instance for global use
export const memoryTransport = new MemoryTransport();
