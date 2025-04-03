import { LogTransport, LogEntry } from '../types';

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

// Memory storage for logs
let logs: LogEntry[] = [];

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
  },
  
  getLogs(): LogEntry[] {
    return [...logs];
  },
  
  clear(): void {
    logs = [];
  }
};
