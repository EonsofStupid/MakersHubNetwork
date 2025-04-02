
import { LoggerCore } from './logger-core';
import { 
  LogCategory, 
  Logger,
  LoggerOptions, 
  LoggingConfig, 
  LogLevel 
} from '../types';
import { logEventEmitter } from '../events/log-event-emitter';
import { defaultLoggingConfig } from '../config';

/**
 * Main logger service with singleton pattern
 */
export class LoggerService {
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
  public getLogs(): any[] {
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

/**
 * Get a logger for a specific source
 */
export function getLogger(source: string = 'App'): Logger {
  const loggerService = LoggerService.getInstance();
  
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
