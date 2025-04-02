
import { v4 as uuidv4 } from 'uuid';
import { 
  LogCategory, 
  LogEntry, 
  Logger,
  LoggerOptions, 
  LoggingConfig, 
  LogLevel 
} from './types';
import { logEventEmitter } from './events';
import { defaultLoggingConfig, getLoggingConfig } from './config';
import { isRecord } from './utils/type-guards';

/**
 * Core logger class that handles log creation and processing
 */
class LoggerCore {
  private buffer: LogEntry[] = [];
  private sessionId: string;
  private userId?: string;
  
  constructor(private config: LoggingConfig) {
    this.sessionId = uuidv4();
  }
  
  /**
   * Update configuration
   */
  public updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Set the current user ID
   */
  public setUserId(userId: string | undefined): void {
    this.userId = userId;
  }
  
  /**
   * Get the current session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }
  
  /**
   * Check if a log should be processed based on level and category
   */
  private shouldProcessLog(level: LogLevel, category?: LogCategory): boolean {
    // Check minimum log level
    if (level < this.config.minLevel) {
      return false;
    }
    
    // Check if category is enabled
    if (
      category &&
      this.config.enabledCategories &&
      this.config.enabledCategories.length > 0 &&
      !this.config.enabledCategories.includes(category)
    ) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Core method to create and buffer a log entry
   */
  public createLogEntry(
    level: LogLevel,
    message: string | number | boolean,
    options?: LoggerOptions & { source?: string }
  ): LogEntry | null {
    if (!this.shouldProcessLog(level, options?.category)) {
      return null;
    }
    
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      category: options?.category || LogCategory.GENERAL,
      message,
      details: isRecord(options?.details) ? options.details : undefined,
      tags: options?.tags
    };
    
    // Add optional fields based on config
    if (this.config.includeSource && options?.source) {
      entry.source = options.source;
    }
    
    if (this.config.includeUser && this.userId) {
      entry.userId = this.userId;
    }
    
    if (this.config.includeSession) {
      entry.sessionId = this.sessionId;
    }
    
    // Add to buffer
    this.buffer.push(entry);
    
    return entry;
  }
  
  /**
   * Process all buffered logs
   */
  public flush(): void {
    if (this.buffer.length === 0) {
      return;
    }
    
    // Create a copy of the buffer
    const logsToProcess = [...this.buffer];
    this.buffer = [];
    
    // Send to all transports
    for (const transport of this.config.transports) {
      try {
        for (const entry of logsToProcess) {
          transport.log(entry);
        }
        
        // Call transport.flush() if available
        if (typeof transport.flush === 'function') {
          transport.flush().catch(error => {
            console.error('Error flushing transport:', error);
          });
        }
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    }
  }
  
  /**
   * Force-flush on critical logs or when buffer is full
   */
  public checkFlush(level: LogLevel): void {
    if (
      level >= LogLevel.ERROR ||
      this.buffer.length >= (this.config.bufferSize || 1)
    ) {
      this.flush();
    }
  }
  
  /**
   * Get logs from memory transport
   */
  public getLogs(): LogEntry[] {
    for (const transport of this.config.transports) {
      if (transport.getLogs) {
        return transport.getLogs();
      }
    }
    return [];
  }
  
  /**
   * Clear logs from memory transport
   */
  public clearLogs(): void {
    for (const transport of this.config.transports) {
      if (transport.clear) {
        transport.clear();
      }
    }
  }
}

/**
 * Main logger service with singleton pattern
 */
class LoggerService {
  private static instance: LoggerService;
  private core: LoggerCore;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  
  private constructor(config: LoggingConfig = defaultLoggingConfig) {
    this.core = new LoggerCore(config);
    this.setupFlushInterval();
  }
  
  /**
   * Get or create the singleton instance
   */
  public static getInstance(config?: LoggingConfig): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(config);
    } else if (config) {
      LoggerService.instance.updateConfig(config);
    }
    return LoggerService.instance;
  }
  
  /**
   * Update configuration
   */
  public updateConfig(config: Partial<LoggingConfig>): void {
    this.core.updateConfig(config);
    
    // Update flush interval if changed
    if (config.flushInterval !== undefined) {
      this.setupFlushInterval();
    }
  }
  
  /**
   * Set up automatic flush interval
   */
  private setupFlushInterval(): void {
    const config = defaultLoggingConfig;
    
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    if (config.flushInterval && config.flushInterval > 0) {
      this.flushInterval = setInterval(() => {
        this.flush();
      }, config.flushInterval);
    }
  }
  
  /**
   * Log a message at TRACE level
   */
  public trace(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.TRACE, message, options);
  }
  
  /**
   * Log a message at DEBUG level
   */
  public debug(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.DEBUG, message, options);
  }
  
  /**
   * Log a message at INFO level
   */
  public info(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.INFO, message, options);
  }
  
  /**
   * Log a message at WARNING level
   */
  public warn(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.WARN, message, options);
  }
  
  /**
   * Log a message at ERROR level
   */
  public error(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.ERROR, message, options);
  }
  
  /**
   * Log a message at CRITICAL level
   */
  public critical(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
  
  /**
   * Log a message at SUCCESS level
   */
  public success(message: string, options?: LoggerOptions & { source?: string }): void {
    this.log(LogLevel.SUCCESS, message, options);
  }
  
  /**
   * Log a performance measurement
   */
  public performance(
    message: string, 
    duration: number, 
    options?: LoggerOptions & { source?: string }
  ): void {
    const category = options?.category || LogCategory.PERFORMANCE;
    const details = { ...(options?.details || {}), duration };
    
    this.log(
      duration > 1000 ? LogLevel.WARN : LogLevel.INFO,
      message,
      {
        ...options,
        category,
        details
      }
    );
  }
  
  /**
   * Core log method
   */
  private log(
    level: LogLevel, 
    message: string, 
    options?: LoggerOptions & { source?: string }
  ): void {
    const entry = this.core.createLogEntry(level, message, options);
    
    if (!entry) {
      return; // Log was filtered out
    }
    
    // Emit real-time log event
    try {
      logEventEmitter.emitLogEvent(entry);
    } catch (error) {
      console.error('Error emitting log event:', error);
    }
    
    // Check if we need to flush immediately
    this.core.checkFlush(level);
  }
  
  /**
   * Manually flush the log buffer
   */
  public flush(): void {
    this.core.flush();
  }
  
  /**
   * Set the current user ID
   */
  public setUserId(userId: string | undefined): void {
    this.core.setUserId(userId);
  }
  
  /**
   * Get the current session ID
   */
  public getSessionId(): string {
    return this.core.getSessionId();
  }
  
  /**
   * Get all logs from memory transport
   */
  public getLogs(): LogEntry[] {
    return this.core.getLogs();
  }
  
  /**
   * Clear logs from memory transport
   */
  public clearLogs(): void {
    this.core.clearLogs();
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush();
  }
}

// Initialize the logger service
export const loggerService = LoggerService.getInstance(getLoggingConfig());

/**
 * Get a logger for a specific source
 */
export function getLogger(source: string = 'App'): Logger {
  return {
    trace: (message: string, options?: LoggerOptions) => {
      loggerService.trace(message, { ...options, source });
    },
    debug: (message: string, options?: LoggerOptions) => {
      loggerService.debug(message, { ...options, source });
    },
    info: (message: string, options?: LoggerOptions) => {
      loggerService.info(message, { ...options, source });
    },
    warn: (message: string, options?: LoggerOptions) => {
      loggerService.warn(message, { ...options, source });
    },
    error: (message: string, options?: LoggerOptions) => {
      loggerService.error(message, { ...options, source });
    },
    critical: (message: string, options?: LoggerOptions) => {
      loggerService.critical(message, { ...options, source });
    },
    success: (message: string, options?: LoggerOptions) => {
      loggerService.success(message, { ...options, source });
    },
    performance: (message: string, duration: number, options?: LoggerOptions) => {
      loggerService.performance(message, duration, { ...options, source });
    }
  };
}
