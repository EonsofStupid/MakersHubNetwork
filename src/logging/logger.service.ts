
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogLevel, LogDetails, LogEntry } from '@/shared/types/shared.types';

// Default config
const DEFAULT_CONFIG = {
  minLevel: LogLevel.INFO,
  includeSource: true,
  enableConsole: true,
};

// Storage for transports
const transports: Array<(entry: LogEntry) => void> = [];

// In-memory log storage
let logEntries: LogEntry[] = [];
const MAX_LOG_ENTRIES = 1000;

// Logger class for the application
export class Logger {
  private source: string;
  private category: LogCategory;

  constructor(source: string, category: LogCategory) {
    this.source = source;
    this.category = category;
  }

  // Log a message at the specified level
  log(level: LogLevel, message: string, details?: LogDetails): void {
    const entry: LogEntry = {
      id: uuidv4(),
      level,
      category: this.category,
      message,
      details: details ? { ...details, source: this.source } : { source: this.source },
      timestamp: new Date().toISOString(),
      source: this.source,
    };

    // Add to in-memory storage with size limit
    logEntries.push(entry);
    if (logEntries.length > MAX_LOG_ENTRIES) {
      logEntries = logEntries.slice(-MAX_LOG_ENTRIES);
    }

    // Process through transports
    transports.forEach(transport => transport(entry));

    // Output to console based on config
    if (DEFAULT_CONFIG.enableConsole) {
      this.logToConsole(entry);
    }
  }

  // Convenience methods for different log levels
  debug(message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, message, details);
  }

  info(message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, message, details);
  }

  warn(message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, message, details);
  }

  error(message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, message, details);
  }

  critical(message: string, details?: LogDetails): void {
    this.log(LogLevel.CRITICAL, message, details);
  }

  trace(message: string, details?: LogDetails): void {
    this.log(LogLevel.TRACE, message, details);
  }

  success(message: string, details?: LogDetails): void {
    this.log(LogLevel.SUCCESS, message, details);
  }

  // Format and output to console with colors
  private logToConsole(entry: LogEntry): void {
    // Skip if below min level
    if (!this.shouldLogLevel(entry.level)) {
      return;
    }

    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const source = entry.source ? `[${entry.source}]` : '';
    let logMethod: keyof Console = 'log';
    let style = '';

    // Determine console method and style based on level
    switch (entry.level) {
      case LogLevel.DEBUG:
        logMethod = 'debug';
        style = 'color: gray';
        break;
      case LogLevel.INFO:
        logMethod = 'info';
        style = 'color: dodgerblue';
        break;
      case LogLevel.WARN:
        logMethod = 'warn';
        style = 'color: orange';
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        logMethod = 'error';
        style = 'color: red; font-weight: bold';
        break;
      case LogLevel.SUCCESS:
        logMethod = 'log';
        style = 'color: green';
        break;
      case LogLevel.TRACE:
        logMethod = 'debug';
        style = 'color: lightgray';
        break;
      default:
        logMethod = 'log';
    }

    // Format the message
    const formattedMessage = `%c${timestamp} [${entry.level}] ${entry.category} ${source}: ${entry.message}`;

    // Log to console with style
    console[logMethod](formattedMessage, style, entry.details || '');
  }

  // Check if we should log at this level
  private shouldLogLevel(level: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.TRACE,
      LogLevel.INFO,
      LogLevel.SUCCESS,
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.CRITICAL,
      LogLevel.FATAL,
    ];

    const minLevelIndex = levels.indexOf(DEFAULT_CONFIG.minLevel);
    const currentLevelIndex = levels.indexOf(level);

    return currentLevelIndex >= minLevelIndex;
  }
}

// Add a transport to the logger
export function addTransport(transport: (entry: LogEntry) => void): void {
  transports.push(transport);
}

// Set minimum log level
export function setMinLogLevel(level: LogLevel): void {
  DEFAULT_CONFIG.minLevel = level;
}

// Get all log entries
export function getLogEntries(): LogEntry[] {
  return [...logEntries];
}

// Clear log entries
export function clearLogEntries(): void {
  logEntries = [];
}

// Create a logger factory
export function createLogger(source: string, category: LogCategory): Logger {
  return new Logger(source, category);
}

// Singleton logger instance for direct use
export const logger = {
  log: (level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('app', category);
    logger.log(level, message, details);
  },
  debug: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('app', category);
    logger.debug(message, details);
  },
  info: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('app', category);
    logger.info(message, details);
  },
  warn: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('app', category);
    logger.warn(message, details);
  },
  error: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('app', category);
    logger.error(message, details);
  },
};

// Hook for use in components
export function useLogger(source: string, category: LogCategory): Logger {
  return new Logger(source, category);
}
