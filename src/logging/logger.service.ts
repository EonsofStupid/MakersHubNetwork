
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/shared.types';

/**
 * Standard logging levels
 */
type LogFunction = (category: LogCategory, message: string, details?: Record<string, any>) => void;

/**
 * Logger interface
 */
interface Logger {
  log: (level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>) => void;
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  success: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  fatal: LogFunction;
  critical: LogFunction;
}

/**
 * Simple in-memory log storage for development
 */
const logs: LogEntry[] = [];

/**
 * Logger service implementation
 */
class LoggerService implements Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private enabledCategories: Set<LogCategory> = new Set(Object.values(LogCategory));
  private listeners: Array<(entry: LogEntry) => void> = [];

  constructor() {
    // Initialize with environment-specific settings
    if (process.env.NODE_ENV === 'development') {
      this.minLevel = LogLevel.DEBUG;
    }
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Enable a specific log category
   */
  enableCategory(category: LogCategory): void {
    this.enabledCategories.add(category);
  }

  /**
   * Disable a specific log category
   */
  disableCategory(category: LogCategory): void {
    this.enabledCategories.delete(category);
  }

  /**
   * Check if a log should be recorded based on level and category
   */
  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    const levelValues = {
      [LogLevel.TRACE]: 0,
      [LogLevel.DEBUG]: 1,
      [LogLevel.INFO]: 2,
      [LogLevel.SUCCESS]: 3,
      [LogLevel.WARN]: 4,
      [LogLevel.ERROR]: 5,
      [LogLevel.FATAL]: 6,
      [LogLevel.CRITICAL]: 7,
      [LogLevel.SILENT]: 8,
    };

    return levelValues[level] >= levelValues[this.minLevel] && 
           this.enabledCategories.has(category);
  }

  /**
   * Add a log entry
   */
  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>): void {
    if (!this.shouldLog(level, category)) {
      return;
    }

    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      category,
      message,
      timestamp: new Date(),
      details,
      source: details?.source,
      tags: details?.tags,
    };

    // Store log entry
    logs.push(entry);

    // Notify listeners
    this.listeners.forEach(listener => listener(entry));

    // Output to console in development
    if (process.env.NODE_ENV === 'development') {
      this.outputToConsole(entry);
    }
  }

  /**
   * Output a log entry to the console
   */
  private outputToConsole(entry: LogEntry): void {
    const { level, category, message, details } = entry;
    const prefix = `[${category}]`;

    switch (level) {
      case LogLevel.TRACE:
        console.trace(prefix, message, details || '');
        break;
      case LogLevel.DEBUG:
        console.debug(prefix, message, details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
      case LogLevel.CRITICAL:
        console.error(prefix, message, details || '');
        break;
      default:
        console.log(prefix, message, details || '');
        break;
    }
  }

  /**
   * Subscribe to log events
   */
  subscribe(listener: (entry: LogEntry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get all log entries
   */
  getLogs(): LogEntry[] {
    return [...logs];
  }

  /**
   * Clear all log entries
   */
  clearLogs(): void {
    logs.length = 0;
  }

  /**
   * Logger convenience methods
   */
  trace(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.TRACE, category, message, details);
  }

  debug(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  info(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.INFO, category, message, details);
  }

  success(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.SUCCESS, category, message, details);
  }

  warn(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.WARN, category, message, details);
  }

  error(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.ERROR, category, message, details);
  }

  fatal(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.FATAL, category, message, details);
  }

  critical(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.CRITICAL, category, message, details);
  }
}

// Create a singleton logger instance
export const logger = new LoggerService();

// Create a logger hook
export function useLogger(source: string, category: LogCategory) {
  return {
    log: (level: LogLevel, message: string, details?: Record<string, any>) => 
      logger.log(level, category, message, { ...details, source }),
    trace: (message: string, details?: Record<string, any>) => 
      logger.trace(category, message, { ...details, source }),
    debug: (message: string, details?: Record<string, any>) => 
      logger.debug(category, message, { ...details, source }),
    info: (message: string, details?: Record<string, any>) => 
      logger.info(category, message, { ...details, source }),
    success: (message: string, details?: Record<string, any>) => 
      logger.success(category, message, { ...details, source }),
    warn: (message: string, details?: Record<string, any>) => 
      logger.warn(category, message, { ...details, source }),
    error: (message: string, details?: Record<string, any>) => 
      logger.error(category, message, { ...details, source }),
    fatal: (message: string, details?: Record<string, any>) => 
      logger.fatal(category, message, { ...details, source }),
    critical: (message: string, details?: Record<string, any>) => 
      logger.critical(category, message, { ...details, source }),
  };
}
