
import { LogEntry, LogTransport } from '../types';
import { LogLevel } from '../constants/log-level';

/**
 * Transport that outputs logs to the browser console
 */
class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.category}]`;
    
    // Format message nicely with colors
    let consoleMethod: 'debug' | 'info' | 'warn' | 'error';
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        consoleMethod = 'debug';
        break;
      case LogLevel.INFO:
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
        consoleMethod = 'info';
    }
    
    // Only log objects if there are details
    if (entry.details) {
      console[consoleMethod](`${prefix} ${entry.message}`, entry.details);
    } else {
      console[consoleMethod](`${prefix} ${entry.message}`);
    }
  }
  
  flush(): Promise<void> {
    return Promise.resolve();
  }
}

// Create singleton instance
export const consoleTransport = new ConsoleTransport();
