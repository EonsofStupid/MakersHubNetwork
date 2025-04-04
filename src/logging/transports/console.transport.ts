
import { LogEntry, LogTransport } from '../types';
import { LogLevel } from '@/constants/logLevel';
import { getLogLevelColorClass } from '../constants/log-level';

/**
 * Console Transport for logging
 * Outputs log messages to browser console with formatting
 */
export class ConsoleTransport implements LogTransport {
  constructor(private options: {
    minLevel?: LogLevel;
    includeTimestamp?: boolean;
    includeSource?: boolean;
    colorize?: boolean;
  } = {}) {}

  log(entry: LogEntry): void {
    const { level, message, source, details, category, timestamp, trace } = entry;
    
    // Skip logs below minimum level
    if (this.options.minLevel && this.isLevelHigherThan(this.options.minLevel, level)) {
      return;
    }
    
    // Format the message
    let formattedMessage = this.formatMessage(entry);
    const logObject: any = {};
    
    // Add metadata to the log object
    if (source) {
      logObject.source = source;
    }
    
    if (category) {
      logObject.category = category;
    }
    
    if (details) {
      logObject.details = details;
    }
    
    if (trace) {
      logObject.trace = trace;
    }
    
    // Choose console method based on log level
    let consoleMethod: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace' = 'log';
    
    switch (level) {
      case LogLevel.TRACE:
        consoleMethod = 'trace';
        break;
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
      case LogLevel.FATAL:
      case LogLevel.CRITICAL:
        consoleMethod = 'error';
        break;
    }
    
    // Log to console with appropriate method
    if (Object.keys(logObject).length === 0) {
      console[consoleMethod](formattedMessage);
    } else {
      console[consoleMethod](formattedMessage, logObject);
    }
  }
  
  private formatMessage(entry: LogEntry): string {
    let formatted = '';
    
    // Add timestamp if enabled
    if (this.options.includeTimestamp && entry.timestamp) {
      formatted += `[${new Date(entry.timestamp).toLocaleTimeString()}] `;
    }
    
    // Add log level
    formatted += `[${entry.level}]`;
    
    // Add source if enabled and available
    if (this.options.includeSource && entry.source) {
      formatted += ` (${entry.source})`;
    }
    
    // Add the actual message
    const stringMessage = typeof entry.message === 'string' 
      ? entry.message 
      : '[React Component]'; // Handle ReactNode case
    
    formatted += `: ${stringMessage}`;
    
    return formatted;
  }
  
  private isLevelHigherThan(baseLevel: LogLevel, checkLevel: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      [LogLevel.TRACE]: 0,
      [LogLevel.DEBUG]: 1,
      [LogLevel.INFO]: 2,
      [LogLevel.WARN]: 3,
      [LogLevel.ERROR]: 4,
      [LogLevel.FATAL]: 5,
      [LogLevel.CRITICAL]: 6,
      [LogLevel.SUCCESS]: 2 // SUCCESS is same level as INFO
    };
    
    return levels[checkLevel] < levels[baseLevel];
  }
  
  // Method to get logs (not available in console transport)
  getLogs(): LogEntry[] {
    return []; // Console doesn't store logs
  }
  
  // Method to clear logs (not available in console transport)
  clear(): void {
    console.clear();
  }
  
  // Method to flush logs (not needed for console)
  async flush(): Promise<void> {
    // No-op for console
  }
}

// Export an instance of the console transport for convenience
export const consoleTransport = new ConsoleTransport({
  includeTimestamp: true,
  includeSource: true,
  colorize: true
});
