
import { LogEntry, LogLevel, LogTransport } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';

/**
 * Format a log entry for console output
 */
function formatLogForConsole(entry: LogEntry): string {
  const timestamp = entry.timestamp.toISOString();
  const level = LOG_LEVEL_NAMES[entry.level];
  const source = entry.source ? `[${entry.source}]` : '';
  
  return `${timestamp} ${level} ${source} ${entry.category}: ${String(entry.message)}`;
}

/**
 * Transport that outputs logs to the browser console
 */
class ConsoleTransport implements LogTransport {
  /**
   * Log an entry to the console
   */
  public log(entry: LogEntry): void {
    const formattedMessage = formatLogForConsole(entry);
    
    // Use the appropriate console method based on log level
    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(formattedMessage, entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedMessage, entry.details || '');
        break;
      default:
        console.log(formattedMessage, entry.details || '');
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
