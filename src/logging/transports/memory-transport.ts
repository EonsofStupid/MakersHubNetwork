import { LogEntry, LogTransport } from '../types';
import { nodeToSearchableString } from '@/shared/utils/render';

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

// In-memory log storage
let logs: LogEntry[] = [];
let listeners: Array<(entry: LogEntry) => void> = [];

/**
 * Memory transport for storing logs in-memory
 * Useful for displaying logs in the UI
 */
export const memoryTransport: LogTransport & {
  getLogs: () => LogEntry[];
  subscribe: (callback: (entry: LogEntry) => void) => () => void;
  clear: () => void;
  search: (query: string) => LogEntry[];
  getLogsByCategory: (category: string) => LogEntry[];
} = {
  log(entry: LogEntry): void {
    // Add to logs array
    logs.unshift(entry);
    
    // Trim if exceeds max logs
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(0, MAX_LOGS);
    }
    
    // Notify listeners
    listeners.forEach(listener => listener(entry));
  },
  
  getLogs(): LogEntry[] {
    return logs;
  },
  
  subscribe(callback: (entry: LogEntry) => void): () => void {
    listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  },
  
  clear(): void {
    logs = [];
  },
  
  search(query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase();
    
    return logs.filter(log => {
      // Search in message
      if (typeof log.message === 'string' && log.message.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search in category
      if (log.category.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search in source
      if (log.source?.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search in details
      if (log.details) {
        const detailsStr = nodeToSearchableString(log.details).toLowerCase();
        if (detailsStr.includes(lowerQuery)) {
          return true;
        }
      }
      
      return false;
    });
  },
  
  getLogsByCategory(category: string): LogEntry[] {
    return logs.filter(log => log.category === category);
  },
  
  async flush(): Promise<void> {
    // No-op for memory transport
  }
};
