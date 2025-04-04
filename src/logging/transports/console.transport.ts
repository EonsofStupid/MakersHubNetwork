
import { LogEntry, LogLevel, LogTransport } from '../types';

// Color mapping for log levels
const LOG_LEVEL_COLORS = {
  [LogLevel.TRACE]: '#6B7280', // gray-500
  [LogLevel.DEBUG]: '#3B82F6', // blue-500
  [LogLevel.INFO]: '#10B981',  // green-500
  [LogLevel.WARN]: '#F59E0B',  // amber-500
  [LogLevel.ERROR]: '#EF4444', // red-500
  [LogLevel.FATAL]: '#7C3AED', // purple-600
  [LogLevel.SUCCESS]: '#10B981', // green-500
  [LogLevel.CRITICAL]: '#DC2626', // red-600
};

// Name mapping for log levels
const LOG_LEVEL_NAMES = {
  [LogLevel.TRACE]: 'TRACE',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
  [LogLevel.SUCCESS]: 'SUCCESS',
  [LogLevel.CRITICAL]: 'CRITICAL'
};

/**
 * Console transport for logging to the browser console
 */
export const consoleTransport: LogTransport = {
  log(entry: LogEntry) {
    const { level, message, source, category, details, timestamp } = entry;
    
    // Get the appropriate console method based on log level
    let method: 'log' | 'info' | 'debug' | 'warn' | 'error' = 'log';
    switch (level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        method = 'debug';
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        method = 'info';
        break;
      case LogLevel.WARN:
        method = 'warn';
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
      case LogLevel.CRITICAL:
        method = 'error';
        break;
    }
    
    // Format timestamp
    const time = typeof timestamp === 'string' 
      ? new Date(timestamp).toLocaleTimeString() 
      : timestamp.toLocaleTimeString();
    
    // Message title with proper styling
    const color = LOG_LEVEL_COLORS[level] || '#3B82F6';
    const levelName = LOG_LEVEL_NAMES[level] || 'LOG';
    
    // Build the title
    const parts = [
      `%c${time}`,
      `%c${levelName}`,
      `%c${category || 'general'}${source ? ' › ' + source : ''}`
    ];
    
    const styles = [
      'color: #888; font-weight: normal;',
      `color: ${color}; font-weight: bold;`,
      'color: #333; font-weight: bold;'
    ];
    
    // Handle browser vs server environment
    if (typeof window !== 'undefined') {
      // Browser environment - pretty formatting
      console.groupCollapsed(`${parts.join(' ')}${message ? ' › ' + message : ''}`, ...styles);
      
      if (details) {
        console.log('Details:', details);
      }
      
      if (entry.tags?.length) {
        console.log('Tags:', entry.tags);
      }
      
      if (entry.trace) {
        console.log('Trace:', entry.trace);
      }
      
      console.groupEnd();
    } else {
      // Server environment - simpler formatting
      console[method](`[${levelName}] [${category}] ${source ? source + ': ' : ''}${message}`);
      if (details) console[method]('Details:', details);
    }
  }
};

/**
 * Extended console transport with additional options
 */
export function createConsoleTransport(options = {}) {
  return {
    ...consoleTransport,
    options,
  };
}
