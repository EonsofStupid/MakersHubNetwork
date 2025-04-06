
import { LogEntry, LogTransport } from '../types';
import { LogLevel, isLogLevelAtLeast } from '../constants/log-level';

export const ConsoleTransport: LogTransport = {
  id: 'console',
  name: 'Console Transport',
  enabled: true,
  
  log: (entry: LogEntry): void => {
    const { level, message, timestamp, category, source, details } = entry;
    
    // Don't log if browser console is not available
    if (typeof console === 'undefined') {
      return;
    }
    
    // Format the message
    const formattedTimestamp = new Date(timestamp).toISOString();
    const prefix = `[${formattedTimestamp}] [${level.toUpperCase()}]${category ? ` [${category}]` : ''}${source ? ` [${source}]` : ''}:`;
    
    // Log to console based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, details || '');
        break;
      case LogLevel.TRACE:
        console.trace(prefix, message, details || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.SUCCESS:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, details || '');
        break;
      case LogLevel.CRITICAL:
        console.error(prefix, message, details || '');
        break;
      default:
        console.log(prefix, message, details || '');
    }
  }
};

// Export for backward compatibility
export const consoleTransport = ConsoleTransport;
