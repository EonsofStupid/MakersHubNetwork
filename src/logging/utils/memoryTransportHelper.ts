
import { LogEntry } from '../types';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Safely get logs from the memory transport
 * Handles the case where getLogs is undefined
 */
export function safeGetLogs(): LogEntry[] {
  if (typeof memoryTransport.getLogs === 'function') {
    return memoryTransport.getLogs();
  }
  return [];
}

/**
 * Safely clear logs from the memory transport
 * Handles the case where clear is undefined
 */
export function safeClearLogs(): void {
  if (typeof memoryTransport.clear === 'function') {
    memoryTransport.clear();
  }
}

/**
 * Get the most recent log entries
 * @param count Number of entries to return
 */
export function getRecentLogs(count: number = 10): LogEntry[] {
  const logs = safeGetLogs();
  return logs.slice(0, count);
}

/**
 * Get logs filtered by level
 * @param level Minimum log level to include
 */
export function getLogsByLevel(level: number): LogEntry[] {
  const logs = safeGetLogs();
  return logs.filter(log => log.level >= level);
}

/**
 * Get logs filtered by category
 * @param category Category to filter by
 */
export function getLogsByCategory(category: string): LogEntry[] {
  const logs = safeGetLogs();
  return logs.filter(log => log.category === category);
}

/**
 * Search logs by text content
 * @param searchText Text to search for in log messages
 */
export function searchLogs(searchText: string): LogEntry[] {
  if (!searchText) return safeGetLogs();
  
  const search = searchText.toLowerCase();
  const logs = safeGetLogs();
  
  return logs.filter(log => {
    // Search in message
    if (log.message && log.message.toLowerCase().includes(search)) {
      return true;
    }
    
    // Search in category
    if (log.category && log.category.toLowerCase().includes(search)) {
      return true;
    }
    
    // Search in source
    if (log.source && log.source.toLowerCase().includes(search)) {
      return true;
    }
    
    // Search in details if it's a string
    if (log.details && typeof log.details === 'object') {
      try {
        const detailsStr = JSON.stringify(log.details).toLowerCase();
        if (detailsStr.includes(search)) {
          return true;
        }
      } catch (e) {
        // Ignore stringify errors
      }
    }
    
    return false;
  });
}
