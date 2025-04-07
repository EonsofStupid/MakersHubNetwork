
import { Transport } from '../transports/transport';
import { LogEntry, LogLevel } from '../types';

/**
 * Transport that keeps logs in memory for UI components to display
 */
export class UiTransport implements Transport {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  private subscribers: Array<(logs: LogEntry[]) => void> = [];

  constructor({ maxLogs = 100 }: { maxLogs?: number } = {}) {
    this.maxLogs = maxLogs;
  }

  log(entry: LogEntry): void {
    // Add log to beginning of array for most recent first
    this.logs.unshift(entry);
    
    // Trim logs if they exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
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
    limit = this.maxLogs 
  }: {
    level?: LogLevel;
    category?: string;
    source?: string;
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
    this.subscribers.forEach(callback => {
      try {
        callback([...this.logs]);
      } catch (error) {
        console.error('Error notifying log subscriber:', error);
      }
    });
  }
}
