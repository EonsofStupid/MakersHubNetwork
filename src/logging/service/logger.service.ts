
import { v4 as uuidv4 } from 'uuid';
import { 
  Logger, 
  LogEntry, 
  LogOptions,
  LoggerOptions, 
  LoggingConfig,
  LogTransport
} from '../types';
import { LogLevel, LogCategory } from '@/constants/logLevel';
import { consoleTransport } from '../transports/console.transport';
import { memoryTransport } from '../transports/memory.transport';
import { logEventEmitter } from '../events';
import { isRecord } from '../utils/type-guards';
import { safelyRenderNode } from '../utils/react';
import { safeDetails } from '../utils/safeDetails';

// Default config
const defaultLoggingConfig: LoggingConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  transports: [consoleTransport, memoryTransport],
  bufferSize: 10,
  flushInterval: 5000, // 5 seconds
  includeSource: true,
  includeUser: true,
  includeSession: true
};

/**
 * Core logger service implementation
 */
class LoggerService {
  private static instance: LoggerService;
  private buffer: LogEntry[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private sessionId: string;
  private userId?: string;
  private config: LoggingConfig;
  
  private constructor(config: LoggingConfig = defaultLoggingConfig) {
    this.config = { ...defaultLoggingConfig, ...config };
    this.sessionId = uuidv4();
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
    this.config = { ...this.config, ...config };
    
    // Update flush interval if changed
    if (config.flushInterval !== undefined) {
      this.setupFlushInterval();
    }
  }
  
  /**
   * Set up automatic flush interval
   */
  private setupFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    if (this.config.flushInterval && this.config.flushInterval > 0) {
      this.flushInterval = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
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
    if (!isLogLevelAtLeast(level, this.config.minLevel)) {
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
    
    // Check if category is disabled
    if (
      category &&
      this.config.disabledCategories &&
      this.config.disabledCategories.includes(category)
    ) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Log a message at TRACE level
   */
  public trace(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.TRACE, message, options);
  }
  
  /**
   * Log a message at DEBUG level
   */
  public debug(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.DEBUG, message, options);
  }
  
  /**
   * Log a message at INFO level
   */
  public info(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.INFO, message, options);
  }
  
  /**
   * Log a message at WARNING level
   */
  public warn(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.WARN, message, options);
  }
  
  /**
   * Log a message at ERROR level
   */
  public error(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.ERROR, message, options);
  }
  
  /**
   * Log a message at CRITICAL level
   */
  public critical(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
  
  /**
   * Log a message at FATAL level
   */
  public fatal(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.FATAL, message, options);
  }
  
  /**
   * Log a message at SUCCESS level
   */
  public success(message: string, options?: LoggerOptions): void {
    this.log(LogLevel.SUCCESS, message, options);
  }
  
  /**
   * Log a performance measurement
   */
  public performance(
    message: string, 
    duration: number, 
    options?: LoggerOptions
  ): void {
    const category = options?.category || LogCategory.PERFORMANCE;
    const details = { 
      ...(isRecord(options?.details) ? options.details : {}), 
      duration 
    };
    
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
    options?: LoggerOptions
  ): void {
    if (!this.shouldProcessLog(level, options?.category as LogCategory)) {
      return; // Log was filtered out
    }
    
    // Process details to ensure they're in a consistent format using safeDetails
    const processedDetails = options?.details ? safeDetails(options.details) : undefined;
    
    // Create the log entry
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      category: (options?.category as LogCategory) || LogCategory.GENERAL,
      message: safelyRenderNode(message),
      details: processedDetails,
      tags: options?.tags || [],
      source: options?.source || 'unknown'
    };
    
    // Add optional fields based on config
    if (this.config.includeUser && this.userId) {
      entry.user_id = this.userId;
    }
    
    if (this.config.includeSession) {
      entry.session_id = this.sessionId;
    }
    
    // Add to buffer
    this.buffer.push(entry);
    
    // Emit real-time log event
    try {
      logEventEmitter.emitLogEvent(entry);
    } catch (error) {
      console.error('Error emitting log event:', safeDetails(error));
    }
    
    // Check if we need to flush immediately
    if (
      level === LogLevel.ERROR || 
      level === LogLevel.FATAL ||
      level === LogLevel.CRITICAL ||
      this.buffer.length >= (this.config.bufferSize || 1)
    ) {
      this.flush();
    }
  }
  
  /**
   * Manually flush the log buffer
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
        if (transport.flush) {
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
   * Get all logs from memory transport
   */
  public getLogs(): LogEntry[] {
    if (memoryTransport.getLogs) {
      return memoryTransport.getLogs();
    }
    return [];
  }
  
  /**
   * Clear logs from memory transport
   */
  public clearLogs(): void {
    if (memoryTransport.clear) {
      memoryTransport.clear();
    }
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

// Helper function to check if a log level meets minimum threshold
function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  const levels: Record<LogLevel, number> = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
    CRITICAL: 6,
    SUCCESS: 2 // SUCCESS is same priority as INFO
  };
  return levels[level] >= levels[minLevel];
}

// Initialize the logger service
const loggerServiceInstance = LoggerService.getInstance();

/**
 * Get a logger for a specific source
 */
export function getLogger(source: string = 'App', options: LoggerOptions = {}): Logger {
  return {
    trace: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.trace(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    debug: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.debug(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    info: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.info(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    warn: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.warn(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    error: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.error(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    fatal: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.fatal(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    critical: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.critical(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    success: (message: string, msgOptions?: LogOptions) => {
      loggerServiceInstance.success(message, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    },
    performance: (message: string, duration: number, msgOptions?: LogOptions) => {
      loggerServiceInstance.performance(message, duration, { 
        source, 
        ...options, 
        ...msgOptions 
      });
    }
  };
}

/**
 * Initialize the logging system
 */
export function initializeLogger(config?: LoggingConfig): void {
  try {
    if (config) {
      LoggerService.getInstance(config);
    }
    
    const logger = getLogger('LoggingSystem');
    logger.info('Logging system initialized successfully', {
      category: LogCategory.SYSTEM
    });
  } catch (error) {
    console.error('Failed to initialize logging system:', error);
  }
}

// Export for use elsewhere
export { loggerServiceInstance as loggerService };
