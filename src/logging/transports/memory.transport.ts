
import { LogTransport, LogEntry } from '../types';

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

// Memory storage for logs
let logs: LogEntry[] = [];
const subscribers = new Set<(entry: LogEntry) => void>();

/**
 * In-memory transport for logging
 * Stores logs in memory for retrieval by log viewers
 */
export const memoryTransport: LogTransport = {
  log(entry: LogEntry): void {
    // Add to the beginning for newest-first order
    logs.unshift({...entry});
    
    // Trim if we exceed the maximum
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(0, MAX_LOGS);
    }
    
    // Notify subscribers
    subscribers.forEach(callback => {
      try {
        callback(entry);
      } catch (error) {
        console.error('Error in log subscriber:', error);
      }
    });
  },
  
  getLogs(limit?: number, filterFn?: (entry: LogEntry) => boolean): LogEntry[] {
    let result = [...logs];
    
    // Apply filter if provided
    if (filterFn) {
      result = result.filter(filterFn);
    }
    
    // Apply limit if provided
    if (typeof limit === 'number' && limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  },
  
  clear(): void {
    logs = [];
  },
  
  subscribe(callback: (entry: LogEntry) => void): () => void {
    subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
    };
  }
};
