
import { LogEntry, LogTransport, LogLevel } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';
import { nodeToSearchableString } from '@/shared/utils/react-utils';

/**
 * Transport for logging to the browser console
 */
class ConsoleTransport implements LogTransport {
  /**
   * Log an entry to the console
   */
  public log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const level = LOG_LEVEL_NAMES[entry.level];
    const source = entry.source ? `[${entry.source}]` : '';
    const category = entry.category ? `[${entry.category}]` : '';
    const message = typeof entry.message === 'string' 
      ? entry.message 
      : nodeToSearchableString(entry.message);
    
    // Format the prefix
    const prefix = `${timestamp} ${level} ${category} ${source}`;
    
    // Select console method based on level
    let consoleMethod: 'log' | 'debug' | 'info' | 'warn' | 'error';
    
    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        consoleMethod = 'debug';
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        consoleMethod = 'info';
        break;
      case LogLevel.WARN:
        consoleMethod = 'warn';
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        consoleMethod = 'error';
        break;
      default:
        consoleMethod = 'log';
    }
    
    // Output to console
    if (entry.details) {
      console[consoleMethod](`${prefix} ${message}`, entry.details);
    } else {
      console[consoleMethod](`${prefix} ${message}`);
    }
  }
  
  /**
   * No-op flush implementation
   */
  public async flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Export singleton instance
export const consoleTransport = new ConsoleTransport();
