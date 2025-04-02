
import { LogEntry, LogLevel, LogTransport } from '../types';
import { LOG_LEVEL_NAMES } from '../constants';

/**
 * Transport that outputs logs to the browser console
 */
class ConsoleTransport implements LogTransport {
  /**
   * Log an entry to the console
   */
  public log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toLocaleTimeString();
    const levelName = LOG_LEVEL_NAMES[entry.level];
    const category = entry.category;
    const source = entry.source ? `[${entry.source}]` : '';
    
    // Format the log message
    const formattedMessage = `${timestamp} ${levelName} ${category}${source}: ${entry.message}`;
    
    // Choose the appropriate console method based on the log level
    let consoleMethod: keyof Console;
    
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
    
    // Styled console output for better readability
    if (typeof window !== 'undefined') {
      this.styledConsoleLog(consoleMethod, entry, formattedMessage);
    } else {
      // Basic console output for non-browser environments
      console[consoleMethod](formattedMessage, entry.details || '');
    }
  }
  
  /**
   * Apply styling to console output in browser environments
   */
  private styledConsoleLog(
    method: keyof Console, 
    entry: LogEntry, 
    message: string
  ): void {
    // Define styles based on log level
    let style = '';
    
    switch (entry.level) {
      case LogLevel.TRACE:
        style = 'color: #6c757d;'; // gray
        break;
      case LogLevel.DEBUG:
        style = 'color: #6c757d;'; // gray
        break;
      case LogLevel.INFO:
        style = 'color: #0dcaf0;'; // info blue
        break;
      case LogLevel.WARN:
        style = 'color: #ffc107; font-weight: bold;'; // warning yellow
        break;
      case LogLevel.ERROR:
        style = 'color: #dc3545; font-weight: bold;'; // error red
        break;
      case LogLevel.CRITICAL:
        style = 'color: #dc3545; font-weight: bold; background: #2c0b0e;'; // critical red with background
        break;
      case LogLevel.SUCCESS:
        style = 'color: #198754;'; // success green
        break;
    }
    
    // Apply console styling
    if (entry.details) {
      console[method](`%c${message}`, style, entry.details);
    } else {
      console[method](`%c${message}`, style);
    }
  }
  
  /**
   * No-op flush implementation (required by interface)
   */
  public async flush(): Promise<void> {
    // Console transport doesn't need to flush
    return Promise.resolve();
  }
}

// Export singleton instance
export const consoleTransport = new ConsoleTransport();
