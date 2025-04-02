
import { LogEntry, LogTransport } from "../types";
import { LogLevel, LOG_LEVEL_NAMES } from "../constants/log-level";

/**
 * Transport for logging to the browser console
 */
class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const source = entry.source ? ` [${entry.source}]` : '';
    const category = entry.category ? `(${entry.category})` : '';
    const levelName = LOG_LEVEL_NAMES[entry.level] || 'UNKNOWN';
    const prefix = `[${timestamp}] [${levelName}]${category}${source}`;
    
    // Prepare the message
    let formattedMessage: string;
    if (typeof entry.message === 'string') {
      formattedMessage = entry.message;
    } else if (typeof entry.message === 'number' || typeof entry.message === 'boolean') {
      formattedMessage = String(entry.message);
    } else {
      formattedMessage = '[React Node]';
    }
    
    const message = `${prefix}: ${formattedMessage}`;
    
    // Log with appropriate console method based on level
    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(message, entry.details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(message, entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(message, entry.details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(message, entry.details || '');
        break;
      default:
        console.log(message, entry.details || '');
    }
  }
  
  flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Export a singleton instance
export const consoleTransport = new ConsoleTransport();
