
import { LogEntry, LogTransport } from '../types';
import { getLoggingConfig } from '../config';
import { v4 as uuidv4 } from 'uuid';

// In-memory log storage
let logEntries: LogEntry[] = [];
let subscribers: ((entry: LogEntry) => void)[] = [];

export const MemoryTransport: LogTransport = {
  id: 'memory',
  name: 'Memory Transport',
  enabled: true,
  
  log: (entry: LogEntry): void => {
    // Add unique id if not provided
    const entryWithId = { 
      ...entry,
      id: entry.id || uuidv4() 
    };
    
    // Add the entry to the memory buffer
    logEntries.push(entryWithId);
    
    // Respect buffer size limit
    const config = getLoggingConfig();
    if (logEntries.length > config.bufferSize) {
      logEntries = logEntries.slice(-config.bufferSize);
    }
    
    // Notify subscribers
    subscribers.forEach(callback => {
      try {
        callback(entryWithId);
      } catch (error) {
        console.error('Error in log subscriber:', error);
      }
    });
  },
  
  // Get all logs stored in memory
  getLogs: (): LogEntry[] => {
    return [...logEntries];
  },
  
  // Clear memory logs
  clear: (): void => {
    logEntries = [];
  },
  
  // Subscribe to new log entries
  subscribe: (callback: (entry: LogEntry) => void) => {
    subscribers.push(callback);
    return {
      unsubscribe: () => {
        subscribers = subscribers.filter(cb => cb !== callback);
      }
    };
  }
};

// Get logs filtered by parameters
export const getFilteredLogs = (filter: {
  level?: string;
  category?: string;
  source?: string;
  search?: string;
}): LogEntry[] => {
  return logEntries.filter(entry => {
    if (filter.level && entry.level !== filter.level) {
      return false;
    }
    if (filter.category && entry.category !== filter.category) {
      return false;
    }
    if (filter.source && entry.source !== filter.source) {
      return false;
    }
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      const message = entry.message.toLowerCase();
      const details = entry.details ? JSON.stringify(entry.details).toLowerCase() : '';
      if (!message.includes(searchTerm) && !details.includes(searchTerm)) {
        return false;
      }
    }
    return true;
  });
};

// Export for backward compatibility
export const memoryTransport = MemoryTransport;
