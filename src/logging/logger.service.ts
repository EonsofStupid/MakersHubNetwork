
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogEntry, LogLevel, LogTransport, LoggingConfig } from './types';

/**
 * Main logger service for handling all logging operations
 */
export class LoggerService {
  private static instance: LoggerService;
  private config: LoggingConfig;
  private buffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private sessionId: string;
  
  private constructor(config: LoggingConfig) {
    this.config = {
      ...config,
      bufferSize: config.bufferSize || 10,
      flushInterval: config.flushInterval || 5000
    };
    
    this.sessionId = uuidv4();
    
    // Set up buffer flush interval if needed
    if (this.config.flushInterval && this.config.flushInterval > 0) {
      this.flushInterval = setInterval(() => this.flush(), this.config.flushInterval);
    }
  }
  
  /**
   * Get the logger instance, creating it if it doesn't exist
   */
  public static getInstance(config?: LoggingConfig): LoggerService {
    if (!LoggerService.instance && config) {
      LoggerService.instance = new LoggerService(config);
    } else if (!LoggerService.instance) {
      throw new Error('Logger not initialized. Call getInstance with config first.');
    }
    
    return LoggerService.instance;
  }
  
  /**
   * Log a message with the DEBUG level
   */
  public debug(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.DEBUG, message, options);
  }
  
  /**
   * Log a message with the INFO level
   */
  public info(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.INFO, message, options);
  }
  
  /**
   * Log a message with the WARNING level
   */
  public warn(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.WARNING, message, options);
  }
  
  /**
   * Log a message with the ERROR level
   */
  public error(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.ERROR, message, options);
  }
  
  /**
   * Log a message with the CRITICAL level
   */
  public critical(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
  
  /**
   * Log a performance measurement
   */
  public performance(message: string, duration: number, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    const level = this.getPerformanceLogLevel(duration);
    
    this.log(level, message, {
      ...options,
      category: options?.category || LogCategory.PERFORMANCE,
      details: {
        ...options?.details,
        duration
      }
    });
  }
  
  /**
   * General log method used by all level-specific methods
   */
  private log(
    level: LogLevel,
    message: string,
    options?: {
      category?: LogCategory;
      details?: unknown;
      source?: string;
      tags?: string[];
    }
  ): void {
    // Skip if below minimum level
    if (level < this.config.minLevel) {
      return;
    }
    
    // Skip if category is not enabled
    if (
      this.config.enabledCategories &&
      options?.category && 
      !this.config.enabledCategories.includes(options.category)
    ) {
      return;
    }
    
    // Create log entry
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      category: options?.category || LogCategory.SYSTEM,
      message,
      details: options?.details,
      source: this.config.includeSource ? options?.source : undefined,
      userId: this.config.includeUser ? this.getUserId() : undefined,
      sessionId: this.config.includeSession ? this.sessionId : undefined,
      tags: options?.tags
    };
    
    // Add to buffer
    this.buffer.push(entry);
    
    // Flush immediately for high levels or if buffer exceeds size
    if (
      level >= LogLevel.ERROR ||
      this.buffer.length >= (this.config.bufferSize || 10)
    ) {
      this.flush();
    }
  }
  
  /**
   * Flush the buffer to all transports
   */
  public async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }
    
    const entries = [...this.buffer];
    this.buffer = [];
    
    // Send to all transports
    for (const transport of this.config.transports) {
      for (const entry of entries) {
        transport.log(entry);
      }
      
      // Call flush if available
      if (transport.flush) {
        await transport.flush();
      }
    }
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    this.flush().catch(e => console.error('Error flushing logs', e));
  }
  
  /**
   * Update logger configuration
   */
  public updateConfig(config: Partial<LoggingConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    
    // Update flush interval if needed
    if (config.flushInterval !== undefined) {
      if (this.flushInterval) {
        clearInterval(this.flushInterval);
        this.flushInterval = null;
      }
      
      if (config.flushInterval > 0) {
        this.flushInterval = setInterval(() => this.flush(), config.flushInterval);
      }
    }
  }
  
  /**
   * Determine log level based on performance duration
   */
  private getPerformanceLogLevel(duration: number): LogLevel {
    if (duration < 100) {
      return LogLevel.DEBUG;
    } else if (duration < 500) {
      return LogLevel.INFO;
    } else if (duration < 1000) {
      return LogLevel.WARNING;
    } else {
      return LogLevel.ERROR;
    }
  }
  
  /**
   * Get current user ID if available
   */
  private getUserId(): string | undefined {
    // This would integrate with your auth system
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Example, replace with your actual auth ID retrieval
        const storedUser = localStorage.getItem('auth-user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            return user?.id || undefined;
          } catch (e) {
            return undefined;
          }
        }
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}

// Create a shorthand function to get the logger instance
export function getLogger(): LoggerService {
  return LoggerService.getInstance();
}
