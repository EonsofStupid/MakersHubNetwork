
import { LogCategory, LogEvent, LogLevel } from './types';

// Define log levels
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
};

// Options for logger
export interface LoggerOptions {
  details?: Record<string, unknown>;
}

// Interface for log transport
export interface LogTransport {
  id: string;
  log: (event: LogEvent) => void | Promise<void>;
  getMinLevel: () => LogLevel;
}

/**
 * Logger class for structured application logging
 */
export class Logger {
  private transports: LogTransport[] = [];
  private category: LogCategory;
  private source: string;

  constructor(source: string, category: LogCategory = LogCategory.APP) {
    this.source = source;
    this.category = category;
  }

  /**
   * Register a transport to receive logs
   */
  addTransport(transport: LogTransport): void {
    if (this.transports.find(t => t.id === transport.id)) {
      return;
    }
    this.transports.push(transport);
  }

  /**
   * Remove a transport by ID
   */
  removeTransport(transportId: string): void {
    this.transports = this.transports.filter(t => t.id !== transportId);
  }

  /**
   * Log at debug level
   */
  debug(message: string, options?: LoggerOptions): void {
    this.log('debug', message, options);
  }

  /**
   * Log at info level
   */
  info(message: string, options?: LoggerOptions): void {
    this.log('info', message, options);
  }

  /**
   * Log at warn level
   */
  warn(message: string, options?: LoggerOptions): void {
    this.log('warn', message, options);
  }

  /**
   * Log at error level
   */
  error(message: string, options?: LoggerOptions): void {
    this.log('error', message, options);
  }

  /**
   * Log at critical level
   */
  critical(message: string, options?: LoggerOptions): void {
    this.log('critical', message, options);
  }

  /**
   * Create a child logger with the same category but different source
   */
  child(source: string): Logger {
    const childLogger = new Logger(`${this.source}.${source}`, this.category);
    
    // Copy transports from parent
    this.transports.forEach(transport => {
      childLogger.addTransport(transport);
    });
    
    return childLogger;
  }

  /**
   * Create a specialized logger for a specific category
   */
  forCategory(category: LogCategory): Logger {
    const categoryLogger = new Logger(this.source, category);
    
    // Copy transports from parent
    this.transports.forEach(transport => {
      categoryLogger.addTransport(transport);
    });
    
    return categoryLogger;
  }

  /**
   * Main log method
   */
  private log(level: LogLevel, message: string, options?: LoggerOptions): void {
    const timestamp = new Date();
    
    const event: LogEvent = {
      level,
      message,
      timestamp,
      source: this.source,
      category: this.category,
      details: options?.details || {},
    };

    // Forward the log to each transport if their level is appropriate
    for (const transport of this.transports) {
      const minLevel = transport.getMinLevel();
      
      if (LOG_LEVELS[level] >= LOG_LEVELS[minLevel || 'info']) {
        try {
          transport.log(event);
        } catch (error) {
          // Don't let transport errors crash the application
          console.error(`Error in log transport ${transport.id}:`, error);
        }
      }
    }
  }
}

// Create default transports
const consoleTransport: LogTransport = {
  id: 'console',
  log: (event: LogEvent) => {
    const { level, message, timestamp, source, category } = event;
    
    // Format timestamp
    const timeString = timestamp.toISOString();
    
    // Format details
    const detailsStr = event.details && Object.keys(event.details).length > 0
      ? ` ${JSON.stringify(event.details)}`
      : '';
    
    // Choose console method based on level
    const logMethod = level === 'error' || level === 'critical'
      ? console.error
      : level === 'warn'
        ? console.warn
        : level === 'info'
          ? console.info
          : console.debug;
    
    // Output the log
    logMethod(`[${timeString}] [${level.toUpperCase()}] [${category}] [${source}] ${message}${detailsStr}`);
  },
  getMinLevel: () => 'debug',
};

// Create and configure the root logger
const rootLogger = new Logger('root');
rootLogger.addTransport(consoleTransport);

// Factory function to create loggers
export function createLogger(source: string, category: LogCategory = LogCategory.APP): Logger {
  const logger = new Logger(source, category);
  
  // Add default transports from root logger
  logger.addTransport(consoleTransport);
  
  return logger;
}
