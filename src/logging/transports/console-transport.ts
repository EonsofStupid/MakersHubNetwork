
import { Transport } from './transport';
import { LogEntry, LogLevel } from '../types';

/**
 * Transport that logs to the browser console
 */
export class ConsoleTransport implements Transport {
  private options: { minLevel?: LogLevel } = {};
  
  constructor(options: { minLevel?: LogLevel } = {}) {
    this.options = options;
  }

  log(entry: LogEntry): void {
    const { level, message, timestamp, category, source, details } = entry;
    const formattedTime = timestamp instanceof Date 
      ? timestamp.toLocaleTimeString()
      : new Date(timestamp).toLocaleTimeString();
    
    const prefix = `[${formattedTime}] [${level.toUpperCase()}] [${category || 'system'}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, details || '', source ? `(${source})` : '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, message, details || '', source ? `(${source})` : '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details || '', source ? `(${source})` : '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, message, details || '', source ? `(${source})` : '');
        break;
      default:
        console.log(prefix, message, details || '', source ? `(${source})` : '');
    }
  }
}
