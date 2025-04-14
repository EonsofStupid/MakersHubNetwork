
import { LogEntry, LogLevel } from '@/shared/types/shared.types';

export class UiTransport {
  private minLevel: LogLevel = LogLevel.INFO;
  private callback?: (entry: LogEntry) => void;
  
  constructor(options: { callback?: (entry: LogEntry) => void } = {}) {
    this.callback = options.callback;
  }
  
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  log(entry: LogEntry): void {
    // Skip logs below minimum level
    if (this.shouldSkipLog(entry.level)) {
      return;
    }
    
    // Call the provided callback if exists
    if (this.callback) {
      this.callback(entry);
    }
    
    // Determine console method based on log level
    let consoleMethod: keyof typeof console;
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
      case LogLevel.FATAL:
        consoleMethod = 'error';
        break;
      case LogLevel.SUCCESS:
        consoleMethod = 'log'; // No success in console, use log
        break;
      case LogLevel.TRACE:
        consoleMethod = 'trace';
        break;
      default:
        consoleMethod = 'log';
    }
    
    // Format console output
    const formattedDetails = entry.details 
      ? Object.keys(entry.details).length > 0 
        ? entry.details 
        : '' 
      : '';
    
    const prefix = `[${entry.category}]`;
    console[consoleMethod](
      `%c${prefix}%c ${entry.message}`, 
      'font-weight: bold; color: #666;',
      'color: inherit',
      formattedDetails
    );
  }
  
  registerCallback(callback: (entry: LogEntry) => void): void {
    this.callback = callback;
  }
  
  private shouldSkipLog(level: LogLevel): boolean {
    const levelValues: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
      [LogLevel.CRITICAL]: 4,
      [LogLevel.FATAL]: 5,
      [LogLevel.TRACE]: -1,
      [LogLevel.SUCCESS]: 2,
      [LogLevel.SILENT]: 100,
    };
    
    return levelValues[level] < levelValues[this.minLevel];
  }
}
