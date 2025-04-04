
import { LogEntry, LogLevel } from '../types';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Safe wrapper to get logs from memory transport
 * Returns empty array if memory transport is not available
 */
export function safeGetLogs(limit?: number, filterFn?: (entry: LogEntry) => boolean): LogEntry[] {
  try {
    if (memoryTransport.getLogs) {
      return memoryTransport.getLogs(limit, filterFn);
    }
    return [];
  } catch (error) {
    console.error('Error getting logs from memory transport:', error);
    return [];
  }
}

/**
 * Safe wrapper to clear logs from memory transport
 */
export function safeClearLogs(): void {
  try {
    if (memoryTransport.clear) {
      memoryTransport.clear();
    }
  } catch (error) {
    console.error('Error clearing logs from memory transport:', error);
  }
}

/**
 * Get logs of a specific level
 */
export function getLogsByLevel(level: LogLevel, limit?: number): LogEntry[] {
  return safeGetLogs(limit, (log) => log.level === level);
}

/**
 * Get logs of a specific category
 */
export function getLogsByCategory(category: string, limit?: number): LogEntry[] {
  return safeGetLogs(limit, (log) => log.category === category);
}

/**
 * Get error logs (ERROR, FATAL, CRITICAL)
 */
export function getErrorLogs(limit?: number): LogEntry[] {
  return safeGetLogs(limit, (log) => {
    // Use numerical values for comparison
    return (
      log.level === LogLevel.ERROR || 
      log.level === LogLevel.FATAL || 
      log.level === LogLevel.CRITICAL
    );
  });
}

/**
 * Subscribe to new logs
 */
export function subscribeToLogs(callback: (log: LogEntry) => void): () => void {
  if (memoryTransport.subscribe) {
    return memoryTransport.subscribe(callback);
  }
  return () => {}; // Empty unsubscribe function
}
