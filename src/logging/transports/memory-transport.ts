
import { Transport } from './transport';
import { LogEntry, LogLevel } from '../types';

/**
 * Transport that keeps logs in memory for internal use
 */
export class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  private subscribers: ((logs: LogEntry[]) => void)[] = [];

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
    
    // Notify subscribers
    this.notifySubscribers();
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
    this.notifySubscribers();
  }

  /**
   * Subscribe to log updates
   */
  subscribe(callback: (logs: LogEntry[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all subscribers of log updates
   */
  private notifySubscribers(): void {
    for (const subscriber of this.subscribers) {
      try {
        subscriber([...this.logs]);
      } catch (error) {
        console.error('Error notifying log subscriber:', error);
      }
    }
  }
  
  /**
   * Add searchable properties to log entry
   */
  private makeSearchable(entry: LogEntry): void {
    // Convert message to searchable string
    if (typeof entry.message === 'string') {
      entry.searchableMessage = entry.message;
    } else {
      entry.searchableMessage = 'React Node';
    }
    
    // Convert details to searchable string if they exist
    if (entry.details) {
      try {
        entry.searchableDetails = JSON.stringify(entry.details);
      } catch (e) {
        entry.searchableDetails = '[Error converting details to searchable string]';
      }
    }
  }
}

// Create a singleton instance
export const memoryTransport = new MemoryTransport();
