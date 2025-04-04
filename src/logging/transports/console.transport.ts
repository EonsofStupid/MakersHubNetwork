
import { LogTransport, LogEntry, LogLevel } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';

/**
 * Options for console transport
 */
export interface ConsoleTransportOptions {
  /** Format string for console output */
  format?: string;
  
  /** Use emoji instead of text for log levels */
  useEmoji?: boolean;
  
  /** Use colors in console output */
  useColors?: boolean;
  
  /** Show timestamps in console output */
  showTimestamp?: boolean;
  
  /** Show log source in console output */
  showSource?: boolean;
  
  /** Minimum log level to display */
  minLevel?: LogLevel;
  
  /** Categories to exclude from console output */
  excludeCategories?: string[];
  
  /** Print details as separate log */
  expandDetails?: boolean;
}

/**
 * Transport that outputs logs to the browser console
 */
export class ConsoleTransport implements LogTransport {
  private options: ConsoleTransportOptions;

  constructor(options: ConsoleTransportOptions = {}) {
    this.options = {
      useEmoji: true,
      useColors: true,
      showTimestamp: true,
      showSource: true,
      minLevel: 'INFO',
      expandDetails: false,
      ...options
    };
  }

  log(entry: LogEntry): void {
    // Check min level
    const logLevels: Record<LogLevel, number> = {
      TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, FATAL: 5
    };
    
    if (this.options.minLevel && logLevels[entry.level] < logLevels[this.options.minLevel]) {
      return;
    }
    
    // Check excluded categories
    if (this.options.excludeCategories?.includes(entry.category)) {
      return;
    }
    
    // Format the log
    let levelEmoji = '';
    let levelColor = '';
    
    if (this.options.useEmoji) {
      switch (entry.level) {
        case 'TRACE': levelEmoji = '🔍'; break;
        case 'DEBUG': levelEmoji = '🐛'; break;
        case 'INFO': levelEmoji = 'ℹ️'; break;
        case 'WARN': levelEmoji = '⚠️'; break;
        case 'ERROR': levelEmoji = '❌'; break;
        case 'FATAL': levelEmoji = '💀'; break;
      }
    }
    
    if (this.options.useColors) {
      switch (entry.level) {
        case 'TRACE': levelColor = 'color: #6b7280'; break;
        case 'DEBUG': levelColor = 'color: #3b82f6'; break;
        case 'INFO': levelColor = 'color: #10b981'; break;
        case 'WARN': levelColor = 'color: #f59e0b'; break;
        case 'ERROR': levelColor = 'color: #ef4444'; break;
        case 'FATAL': levelColor = 'color: #ef4444; font-weight: bold'; break;
      }
    }
    
    // Base parts of the log message
    const parts: string[] = [];
    
    // Timestamp
    if (this.options.showTimestamp) {
      const date = new Date(entry.timestamp);
      parts.push(`[${date.toLocaleTimeString()}]`);
    }
    
    // Log level
    const level = this.options.useEmoji 
      ? levelEmoji 
      : `[${LOG_LEVEL_NAMES[entry.level]}]`;
    parts.push(level);
    
    // Source and category
    if (this.options.showSource && entry.source) {
      const category = entry.category ? `(${entry.category})` : '';
      parts.push(`${entry.source}${category}:`);
    }
    
    // Message
    parts.push(entry.message);
    
    // Choose console method based on level
    let consoleMethod: 'log' | 'info' | 'warn' | 'error' | 'debug';
    switch (entry.level) {
      case 'TRACE': consoleMethod = 'debug'; break;
      case 'DEBUG': consoleMethod = 'debug'; break;
      case 'INFO': consoleMethod = 'info'; break;
      case 'WARN': consoleMethod = 'warn'; break;
      case 'ERROR': consoleMethod = 'error'; break;
      case 'FATAL': consoleMethod = 'error'; break;
      default: consoleMethod = 'log';
    }
    
    // Format the full message
    const message = parts.join(' ');
    
    // Log the message with appropriate styling
    if (this.options.useColors) {
      console[consoleMethod](`%c${message}`, levelColor);
    } else {
      console[consoleMethod](message);
    }
    
    // Log details separately if needed
    if (entry.details && Object.keys(entry.details).length > 0) {
      if (this.options.expandDetails) {
        console.groupCollapsed('Details');
        console.log(entry.details);
        console.groupEnd();
      } else {
        console.log('Details:', entry.details);
      }
    }
    
    // Log trace if available
    if (entry.trace) {
      console.groupCollapsed('Stack Trace');
      console.log(entry.trace);
      console.groupEnd();
    }
  }
}
