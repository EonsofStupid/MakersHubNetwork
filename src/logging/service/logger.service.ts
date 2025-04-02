
import { v4 as uuidv4 } from 'uuid';
import { 
  Logger, 
  LogEntry, 
  LogLevel, 
  LogCategory, 
  LoggerOptions, 
  LogTransport
} from '../types';
import { consoleTransport } from '../transports/console.transport';
import { memoryTransport } from '../transports/memory.transport';
import { logEventEmitter } from '../events';
import { isRecord } from '../utils/type-guards';

/**
 * Default configuration for the logger
 */
const DEFAULT_CONFIG = {
  minLevel: LogLevel.INFO,
  transports: [consoleTransport, memoryTransport],
  bufferSize: 1000,
  flushInterval: 10000,
  includeSource: true,
};

/**
 * Core logger service implementation
 */
class LoggerService implements Logger {
  private config = DEFAULT_CONFIG;
  private defaultSource = 'app';
  
  /**
   * Initialize logger with optional configuration
   */
  constructor() {
    // Pre-bind methods to maintain context
    this.trace = this.trace.bind(this);
    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.critical = this.critical.bind(this);
    this.success = this.success.bind(this);
    this.performance = this.performance.bind(this);
    this.log = this.log.bind(this);
  }
  
  /**
   * Create a log entry with common attributes
   */
  private createLogEntry(
    level: LogLevel, 
    message: string, 
    options?: LoggerOptions
  ): LogEntry {
    return {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      message,
      category: options?.category || LogCategory.GENERAL,
      source: options?.source || this.defaultSource,
      details: options?.details,
      tags: options?.tags,
    };
  }
  
  /**
   * Send log entry to all transports
   */
  private processLogEntry(entry: LogEntry): void {
    // Send to all transports
    for (const transport of this.config.transports) {
      transport.log(entry);
    }
    
    // Emit event for subscribers
    logEventEmitter.emitLogEvent(entry);
  }
  
  /**
   * Log a message at the specified level
   */
  public log(level: LogLevel, message: string, options?: LoggerOptions): void {
    // Skip if below minimum level
    if (level < this.config.minLevel) {
      return;
    }
    
    const entry = this.createLogEntry(level, message, options);
    this.processLogEntry(entry);
  }
  
  /**
   * Log a trace message (lowest level)
   */
  public trace(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.TRACE, message, options);
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.DEBUG, message, options);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.INFO, message, options);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.WARN, message, options);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.ERROR, message, options);
  }
  
  /**
   * Log a critical error message
   */
  public critical(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
  
  /**
   * Log a success message
   */
  public success(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.SUCCESS, message, options);
  }
  
  /**
   * Log a performance measurement
   */
  public performance(message: string, duration: number, options?: LoggerOptions): void {
    this.log(LogLevel.INFO, `${message} (${duration.toFixed(2)}ms)`, {
      ...options,
      category: options?.category || LogCategory.PERFORMANCE,
      details: {
        ...(options?.details || {}),
        duration,
      },
    });
  }
  
  /**
   * Get all logs from memory transport
   */
  public getLogs(): LogEntry[] {
    const memoryTransportInstance = this.config.transports.find(
      t => t === memoryTransport || t.constructor.name === 'MemoryTransport'
    ) as LogTransport & { getLogs?: () => LogEntry[] };
    
    return memoryTransportInstance?.getLogs?.() || [];
  }
  
  /**
   * Clear logs from memory transport
   */
  public clearLogs(): void {
    const memoryTransportInstance = this.config.transports.find(
      t => t === memoryTransport || t.constructor.name === 'MemoryTransport'
    ) as LogTransport & { clear?: () => void };
    
    memoryTransportInstance?.clear?.();
  }
  
  /**
   * Add a transport to the logger
   */
  public addTransport(transport: LogTransport): void {
    if (!this.config.transports.includes(transport)) {
      this.config.transports.push(transport);
    }
  }
  
  /**
   * Remove a transport from the logger
   */
  public removeTransport(transport: LogTransport): void {
    this.config.transports = this.config.transports.filter(t => t !== transport);
  }
  
  /**
   * Set the minimum log level
   */
  public setMinLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }
  
  /**
   * Set the default source for logs
   */
  public setDefaultSource(source: string): void {
    this.defaultSource = source;
  }
  
  /**
   * Create a new logger with a specific source
   */
  public createLogger(source: string): Logger {
    const scopedLogger: Logger = {
      trace: (message, options) => this.trace(message, { ...options, source }),
      debug: (message, options) => this.debug(message, { ...options, source }),
      info: (message, options) => this.info(message, { ...options, source }),
      warn: (message, options) => this.warn(message, { ...options, source }),
      error: (message, options) => this.error(message, { ...options, source }),
      critical: (message, options) => this.critical(message, { ...options, source }),
      success: (message, options) => this.success(message, { ...options, source }),
      performance: (message, duration, options) => this.performance(message, duration, { ...options, source }),
    };
    
    return scopedLogger;
  }
  
  /**
   * Flush all transports
   */
  public async flush(): Promise<void> {
    await Promise.all(
      this.config.transports
        .filter(t => typeof t.flush === 'function')
        .map(t => t.flush && t.flush())
    );
  }
}

// Create singleton instance
export const loggerService = new LoggerService();

/**
 * Get a logger with a specific source
 */
export function getLogger(source = 'app'): Logger {
  return loggerService.createLogger(source);
}
