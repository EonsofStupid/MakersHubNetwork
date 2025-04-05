import { LogEntry, LogLevel } from '../types';

export interface MemoryTransportOptions {
  maxEntries?: number;
  minimumLevel?: LogLevel;
  filterByCategory?: string[];
}

interface LogBuffer {
  entries: LogEntry[];
  maxSize: number;
}

const DEFAULT_OPTIONS: MemoryTransportOptions = {
  maxEntries: 1000,
  minimumLevel: LogLevel.DEBUG,
};

/**
 * Creates a buffer for storing log entries in memory
 */
export function createMemoryBuffer(options: MemoryTransportOptions = {}): LogBuffer {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  return {
    entries: [],
    maxSize: mergedOptions.maxEntries || 1000,
  };
}

/**
 * Adds a log entry to the buffer, maintaining size constraints
 */
export function addToBuffer(buffer: LogBuffer, entry: LogEntry): void {
  buffer.entries.push(entry);
  
  // Keep the buffer size within the limits
  if (buffer.entries.length > buffer.maxSize) {
    buffer.entries = buffer.entries.slice(-buffer.maxSize);
  }
}

/**
 * Filters log entries in a buffer based on provided criteria
 */
export function filterEntries(
  buffer: LogBuffer,
  options: {
    level?: LogLevel;
    category?: string | string[];
    search?: string;
    limit?: number;
  } = {}
): LogEntry[] {
  let results = [...buffer.entries];
  
  // Filter by level
  if (options.level !== undefined) {
    results = results.filter((entry) => {
      const entryLevel = entry.level;
      
      // Special handling for level filtering
      switch (options.level) {
        case LogLevel.TRACE:
          return true; // Show all logs
        case LogLevel.DEBUG:
          return entryLevel !== LogLevel.TRACE;
        case LogLevel.INFO:
        case LogLevel.SUCCESS:
          return entryLevel !== LogLevel.TRACE && entryLevel !== LogLevel.DEBUG;
        case LogLevel.WARN:
          return entryLevel !== LogLevel.TRACE && entryLevel !== LogLevel.DEBUG && 
                 entryLevel !== LogLevel.INFO && entryLevel !== LogLevel.SUCCESS;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          return entryLevel === LogLevel.ERROR || entryLevel === LogLevel.CRITICAL || entryLevel === LogLevel.FATAL;
        case LogLevel.FATAL:
          return entryLevel === LogLevel.FATAL;
        default:
          return true;
      }
    });
  }
  
  // Filter by category
  if (options.category) {
    const categories = Array.isArray(options.category) ? options.category : [options.category];
    if (categories.length > 0) {
      results = results.filter((entry) => 
        categories.includes(entry.category || 'general')
      );
    }
  }
  
  // Filter by search term
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    results = results.filter((entry) => {
      const message = (entry.message || '').toLowerCase();
      const source = (entry.source || '').toLowerCase();
      const category = (entry.category || '').toLowerCase();
      
      return message.includes(searchLower) || 
             source.includes(searchLower) || 
             category.includes(searchLower);
    });
  }
  
  // Apply limit
  if (options.limit && options.limit > 0) {
    results = results.slice(-options.limit);
  }
  
  return results;
}

/**
 * Clears all entries from the buffer
 */
export function clearBuffer(buffer: LogBuffer): void {
  buffer.entries = [];
}
