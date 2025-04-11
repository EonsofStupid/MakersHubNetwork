
import { LogEntry, LogLevel, LogTransport, LogFilterOptions } from '@/logging/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Browser console log transport
 */
export class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const timestamp = typeof entry.timestamp === 'string' 
      ? entry.timestamp 
      : entry.timestamp.toISOString();
      
    const prefix = `[${timestamp.split('T')[1].split('.')[0]}] [${entry.category}]`;
    
    // Map log levels to console methods
    switch (entry.level) {
      case LogLevel.TRACE:
        console.trace(`${prefix} TRACE:`, entry.message, entry.details || '');
        break;
      case LogLevel.DEBUG:
        console.debug(`${prefix} DEBUG:`, entry.message, entry.details || '');
        break;
      case LogLevel.INFO:
        console.info(`${prefix} INFO:`, entry.message, entry.details || '');
        break;
      case LogLevel.SUCCESS:
        console.log(`%c${prefix} SUCCESS: ${entry.message}`, 'color: green', entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} WARN:`, entry.message, entry.details || '');
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} ERROR:`, entry.message, entry.details || '');
        break;
      case LogLevel.CRITICAL:
        console.error(`%c${prefix} CRITICAL: ${entry.message}`, 'color: red; font-weight: bold', entry.details || '');
        break;
      default:
        console.log(`${prefix}:`, entry.message, entry.details || '');
    }
  }
  
  // Implement required interface methods with minimal functionality
  getEntries(filter?: LogFilterOptions): LogEntry[] {
    // Console transport doesn't store logs, so return empty array
    return [];
  }
  
  clear(): void {
    // Clear the console
    console.clear();
  }
}
