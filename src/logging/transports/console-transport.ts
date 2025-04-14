
import { LogEntry, LogLevel } from '@/shared/types/shared.types';
import { LogTransport } from '../logger.service';

/**
 * A transport that outputs logs to the console
 */
export class ConsoleTransport implements LogTransport {
  private minLevel: LogLevel = LogLevel.DEBUG;
  private showTimestamp: boolean = true;
  
  constructor(options?: { minLevel?: LogLevel; showTimestamp?: boolean }) {
    this.minLevel = options?.minLevel || LogLevel.DEBUG;
    this.showTimestamp = options?.showTimestamp !== false;
  }
  
  log(entry: LogEntry): void {
    // Skip logs below minimum level
    if (this.shouldSkip(entry.level)) {
      return;
    }
    
    const prefix = this.formatPrefix(entry);
    const message = this.formatMessage(entry);
    
    // Choose console method based on log level
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, entry.details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, message, entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, entry.details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
      case LogLevel.CRITICAL:
        console.error(prefix, message, entry.details || '');
        break;
      default:
        console.log(prefix, message, entry.details || '');
    }
  }
  
  private shouldSkip(level: LogLevel): boolean {
    // Define log level hierarchy for comparison
    const levels: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.SUCCESS]: 2,
      [LogLevel.WARN]: 3,
      [LogLevel.ERROR]: 4,
      [LogLevel.FATAL]: 5,
      [LogLevel.CRITICAL]: 6,
      [LogLevel.TRACE]: -1,
      [LogLevel.SILENT]: 7
    };
    
    return levels[level] < levels[this.minLevel];
  }
  
  private formatPrefix(entry: LogEntry): string {
    let prefix = `[${entry.category}]`;
    
    if (this.showTimestamp) {
      const timestamp = entry.timestamp.toISOString().split('T')[1].slice(0, -1);
      prefix = `[${timestamp}] ${prefix}`;
    }
    
    if (entry.source) {
      prefix = `${prefix} [${entry.source}]`;
    }
    
    return prefix;
  }
  
  private formatMessage(entry: LogEntry): string {
    return entry.message;
  }
}
