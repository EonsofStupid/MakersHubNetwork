
import { LogEntry, LogLevel, LogTransport } from '../types';
import { LOG_LEVEL_VALUES } from '@/shared/types/shared.types';

export class ConsoleTransport implements LogTransport {
  constructor() {}

  public log(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const logPrefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] [${entry.source}]:`;
    
    // Use appropriate console method based on log level
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(
          `%c${logPrefix}`, 
          'color: gray; font-weight: bold;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      case LogLevel.INFO:
        console.info(
          `%c${logPrefix}`, 
          'color: dodgerblue; font-weight: bold;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      case LogLevel.SUCCESS:
        console.info(
          `%c${logPrefix}`, 
          'color: limegreen; font-weight: bold;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      case LogLevel.TRACE:
        console.debug(
          `%c${logPrefix}`, 
          'color: gray; font-weight: normal;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      case LogLevel.WARN:
        console.warn(
          `%c${logPrefix}`, 
          'color: orange; font-weight: bold;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      case LogLevel.ERROR:
        console.error(
          `%c${logPrefix}`, 
          'color: red; font-weight: bold;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      case LogLevel.CRITICAL:
        console.error(
          `%c${logPrefix}`, 
          'color: white; background-color: red; font-weight: bold; padding: 2px 5px; border-radius: 3px;', 
          entry.message, 
          entry.details || ''
        );
        break;
        
      default:
        console.log(
          `%c${logPrefix}`, 
          'color: gray; font-weight: normal;', 
          entry.message, 
          entry.details || ''
        );
    }
  }

  public clear(): void {
    console.clear();
  }
}

// Create and export singleton instance
export const consoleTransport = new ConsoleTransport();
