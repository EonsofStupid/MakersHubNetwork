
import { LogEntry, LogTransport } from '../types';
import { getLoggingConfig } from '../config';

// In-memory log storage
let logEntries: LogEntry[] = [];

export const MemoryTransport: LogTransport = {
  id: 'memory',
  name: 'Memory Transport',
  enabled: true,
  
  log: (entry: LogEntry): void => {
    // Add the entry to the memory buffer
    logEntries.push(entry);
    
    // Respect buffer size limit
    const config = getLoggingConfig();
    if (logEntries.length > config.bufferSize) {
      logEntries = logEntries.slice(-config.bufferSize);
    }
  }
};

// Get all logs stored in memory
export const getMemoryLogs = (): LogEntry[] => {
  return [...logEntries];
};

// Clear memory logs
export const clearMemoryLogs = (): void => {
  logEntries = [];
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
