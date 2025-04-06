
import { LogCategory, LogEntry, LogLevel, LogOptions, LogTransport } from './types';
import { memoryTransport } from './config';

export class LoggerService {
  private static instance: LoggerService;
  private transports: LogTransport[] = [];
  private enabled: boolean = true;
  private minLevel: LogLevel = LogLevel.DEBUG;

  private constructor(config?: { enabled?: boolean; minLevel?: LogLevel }) {
    this.enabled = config?.enabled !== false;
    this.minLevel = config?.minLevel || LogLevel.DEBUG;
    
    // Add memory transport by default
    this.registerTransport(memoryTransport);
  }

  /**
   * Get the singleton instance of the LoggerService
   */
  static getInstance(config?: { enabled?: boolean; minLevel?: LogLevel }): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(config);
    }
    return LoggerService.instance;
  }

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Register a transport
   */
  registerTransport(transport: LogTransport): void {
    if (!this.transports.find(t => t.id === transport.id)) {
      this.transports.push(transport);
    }
  }

  /**
   * Unregister a transport
   */
  unregisterTransport(transportId: string): void {
    this.transports = this.transports.filter(t => t.id !== transportId);
  }

  /**
   * Get all registered transports
   */
  getTransports(): LogTransport[] {
    return [...this.transports];
  }

  /**
   * Log a debug message
   */
  debug(message: string, options?: LogOptions): void {
    this.log(LogLevel.DEBUG, message, options);
  }

  /**
   * Log an info message
   */
  info(message: string, options?: LogOptions): void {
    this.log(LogLevel.INFO, message, options);
  }

  /**
   * Log a warning message
   */
  warn(message: string, options?: LogOptions): void {
    this.log(LogLevel.WARN, message, options);
  }

  /**
   * Log an error message
   */
  error(message: string, options?: LogOptions): void {
    this.log(LogLevel.ERROR, message, options);
  }

  /**
   * Log a critical message
   */
  critical(message: string, options?: LogOptions): void {
    this.log(LogLevel.CRITICAL, message, options);
  }

  /**
   * Log a custom timing
   */
  logCustomTiming(name: string, duration: number, options?: LogOptions): void {
    const entry: LogEntry = {
      level: LogLevel.DEBUG,
      message: `Performance: ${name} took ${duration}ms`,
      timestamp: new Date(),
      category: options?.category || LogCategory.PERFORMANCE,
      source: options?.source || 'unknown',
      details: {
        ...options?.details,
        name,
        duration,
        performanceMetric: true
      }
    };
    
    this.publishLogEntry(entry);
  }

  /**
   * Log a message with the specified level
   */
  private log(level: LogLevel, message: string, options?: LogOptions): void {
    if (!this.enabled || level < this.minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      category: options?.category || LogCategory.APPLICATION,
      source: options?.source || 'unknown',
      details: options?.details
    };

    this.publishLogEntry(entry);
  }

  /**
   * Send the log entry to all registered transports
   */
  private publishLogEntry(entry: LogEntry): void {
    this.transports.forEach(transport => {
      if (transport.enabled) {
        transport.log(entry);
      }
    });
  }
}

/**
 * Singleton function to get a logger instance
 * @param source Optional source of the log
 * @param defaultCategory Optional default category for all logs from this logger
 * @returns Logger instance
 */
export function getLogger(source?: string, defaultCategory?: LogCategory) {
  const loggerService = LoggerService.getInstance();
  
  return {
    debug: (message: string, options?: LogOptions) => {
      loggerService.debug(message, {
        ...options,
        source: options?.source || source,
        category: options?.category || defaultCategory
      });
    },
    
    info: (message: string, options?: LogOptions) => {
      loggerService.info(message, {
        ...options,
        source: options?.source || source,
        category: options?.category || defaultCategory
      });
    },
    
    warn: (message: string, options?: LogOptions) => {
      loggerService.warn(message, {
        ...options,
        source: options?.source || source,
        category: options?.category || defaultCategory
      });
    },
    
    error: (message: string, options?: LogOptions) => {
      loggerService.error(message, {
        ...options,
        source: options?.source || source,
        category: options?.category || defaultCategory
      });
    },
    
    critical: (message: string, options?: LogOptions) => {
      loggerService.critical(message, {
        ...options,
        source: options?.source || source,
        category: options?.category || defaultCategory
      });
    },
    
    logCustomTiming: (name: string, duration: number, options?: LogOptions) => {
      loggerService.logCustomTiming(name, duration, {
        ...options,
        source: options?.source || source,
        category: options?.category || defaultCategory || LogCategory.PERFORMANCE
      });
    }
  };
}
