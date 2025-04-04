
import { LogEntry, LogLevel } from '../types';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Safely get logs from memory transport with error handling
 */
export function safeGetLogs(): LogEntry[] {
  try {
    if (typeof memoryTransport.getLogs === 'function') {
      return memoryTransport.getLogs();
    }
    return [];
  } catch (error) {
    console.error('Error getting logs from memory transport:', error);
    return [];
  }
}

/**
 * Safely clear logs from memory transport with error handling
 */
export function safeClearLogs(): boolean {
  try {
    if (typeof memoryTransport.clear === 'function') {
      memoryTransport.clear();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing logs from memory transport:', error);
    return false;
  }
}

/**
 * Filter logs by level
 */
export function filterLogsByLevel(logs: LogEntry[], minLevel: LogLevel): LogEntry[] {
  try {
    const levels: Record<LogLevel, number> = {
      TRACE: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      FATAL: 5,
      CRITICAL: 6,
      SUCCESS: 2
    };
    
    return logs.filter(log => {
      const logLevelValue = levels[log.level];
      const minLevelValue = levels[minLevel];
      return logLevelValue >= minLevelValue;
    });
  } catch (error) {
    console.error('Error filtering logs by level:', error);
    return logs;
  }
}

/**
 * Filter logs by category
 */
export function filterLogsByCategory(logs: LogEntry[], category: string): LogEntry[] {
  return logs.filter(log => log.category === category);
}

/**
 * Filter logs by tag
 */
export function filterLogsByTag(logs: LogEntry[], tag: string): LogEntry[] {
  return logs.filter(log => log.tags && log.tags.includes(tag));
}

/**
 * Search logs by text
 */
export function searchLogs(logs: LogEntry[], searchText: string): LogEntry[] {
  if (!searchText) return logs;
  
  const lowerSearchText = searchText.toLowerCase();
  
  return logs.filter(log => {
    // Search in message
    if (log.message && typeof log.message === 'string' && 
        log.message.toLowerCase().includes(lowerSearchText)) {
      return true;
    }
    
    // Search in source
    if (log.source && typeof log.source === 'string' && 
        log.source.toLowerCase().includes(lowerSearchText)) {
      return true;
    }
    
    // Search in details if it's stringifiable
    if (log.details) {
      try {
        const detailsStr = JSON.stringify(log.details).toLowerCase();
        if (detailsStr.includes(lowerSearchText)) {
          return true;
        }
      } catch {
        // Ignore error if details can't be stringified
      }
    }
    
    return false;
  });
}
