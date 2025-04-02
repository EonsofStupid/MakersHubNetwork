
import { LogEntry, LogLevel, LogTransport } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';

/**
 * Transport that logs to the browser console
 */
class ConsoleTransport implements LogTransport {
  /**
   * Log an entry to the console
   */
  public log(entry: LogEntry): void {
    const { level, message, timestamp, source, category, details } = entry;
    
    // Format timestamp
    const time = timestamp.toISOString().split('T')[1].slice(0, 8);
    
    // Prepare message elements
    const prefix = `[${time}] [${LOG_LEVEL_NAMES[level]}] [${category}]${source ? ` [${source}]` : ''}:`;
    
    // Log to console using appropriate method
    switch (level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(prefix, message, details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, message, details || '');
        break;
      default:
        console.log(prefix, message, details || '');
    }
  }
  
  /**
   * Flush implementation (no-op for console)
   */
  public async flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Export singleton instance
export const consoleTransport = new ConsoleTransport();
