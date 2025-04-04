
import { LogEntry, LogTransport } from '../types';

interface MemoryTransportOptions {
  maxSize?: number;
}

// Default options
const DEFAULT_MAX_SIZE = 1000;

// Store logs in memory
let logs: LogEntry[] = [];
const subscriptions: Set<(entry: LogEntry) => void> = new Set();

/**
 * Transport that stores logs in memory
 */
export const memoryTransport: LogTransport = {
  log(entry: LogEntry) {
    // Add log to memory
    logs.push(entry);
    
    // Enforce max size
    if (logs.length > DEFAULT_MAX_SIZE) {
      logs = logs.slice(-DEFAULT_MAX_SIZE);
    }
    
    // Notify subscribers
    subscriptions.forEach(callback => {
      try {
        callback(entry);
      } catch (error) {
        console.error('Error in memory transport subscriber:', error);
      }
    });
  },

  getLogs(limit?: number, filterFn?: (entry: LogEntry) => boolean) {
    let result = logs;
    
    if (filterFn) {
      result = result.filter(filterFn);
    }
    
    if (limit && limit > 0) {
      result = result.slice(-limit);
    }
    
    return result;
  },

  clear() {
    logs = [];
  },

  subscribe(callback: (entry: LogEntry) => void) {
    subscriptions.add(callback);
    
    // Return unsubscribe function
    return () => {
      subscriptions.delete(callback);
    };
  }
};

/**
 * Initialize the memory transport with options
 */
export function initMemoryTransport(options: MemoryTransportOptions = {}) {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  
  // Trim logs if needed
  if (logs.length > maxSize) {
    logs = logs.slice(-maxSize);
  }
}
