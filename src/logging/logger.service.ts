
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogEntry, LogLevel, LogTransport, LoggingConfig } from './types';

/**
 * Core Logger Service
 * Centralizes logging functionality and handles dispatching to various transports
 */
export class LoggerService {
  private static instance: LoggerService;
  private config: LoggingConfig;
  private buffer: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  private constructor(config: LoggingConfig) {
    this.config = config;
    
    // Set up flush interval if specified
    if (config.flushInterval && config.flushInterval > 0) {
      this.flushTimer = setInterval(() => this.flush(), config.flushInterval);
    }
    
    // Initial log entry to confirm service startup
    this.info('Logger service initialized', { 
      category: LogCategory.SYSTEM,
      source: 'logger.service.ts',
      details: { config }
    });
  }

  /**
   * Get or create the logger instance (Singleton pattern)
   */
  public static getInstance(config?: LoggingConfig): LoggerService {
    if (!LoggerService.instance) {
      if (!config) {
        throw new Error('Logger must be initialized with a config the first time');
      }
      LoggerService.instance = new LoggerService(config);
    } else if (config) {
      // If config is provided and instance exists, update the config
      LoggerService.instance.updateConfig(config);
    }
    
    return LoggerService.instance;
  }

  /**
   * Update logger configuration
   */
  public updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reset flush timer if interval changed
    if (config.flushInterval && this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = setInterval(() => this.flush(), config.flushInterval);
    }
  }

  /**
   * Helper to check if a log should be processed based on level and category
   */
  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    // Check minimum log level
    if (level < this.config.minLevel) {
      return false;
    }
    
    // Check if category is enabled
    if (this.config.enabledCategories && 
        !this.config.enabledCategories.includes(category)) {
      return false;
    }
    
    return true;
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel, 
    message: string, 
    options?: {
      category?: LogCategory;
      details?: unknown;
      source?: string;
      userId?: string;
      sessionId?: string;
      duration?: number;
      tags?: string[];
    }
  ): LogEntry {
    const timestamp = new Date();
    const category = options?.category || LogCategory.SYSTEM;
    
    return {
      id: uuidv4(),
      timestamp,
      level,
      message,
      category,
      details: options?.details,
      source: options?.source,
      userId: options?.userId,
      sessionId: options?.sessionId,
      duration: options?.duration,
      tags: options?.tags
    };
  }

  /**
   * Process a log entry - either buffer it or send it directly
   */
  private processLogEntry(entry: LogEntry): void {
    // Add to buffer if buffering is enabled
    if (this.config.bufferSize && this.config.bufferSize > 0) {
      this.buffer.push(entry);
      
      // Flush if buffer is full
      if (this.buffer.length >= this.config.bufferSize) {
        this.flush();
      }
    } else {
      // Direct processing (no buffer)
      this.sendToTransports(entry);
    }
  }

  /**
   * Send an entry to all transports
   */
  private sendToTransports(entry: LogEntry): void {
    this.config.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
  }

  /**
   * Flush the buffer to all transports
   */
  public async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    // Send each buffered entry to all transports
    this.buffer.forEach(entry => {
      this.sendToTransports(entry);
    });
    
    // Clear the buffer
    this.buffer = [];
    
    // Call flush on transports that support it
    await Promise.all(
      this.config.transports
        .filter(transport => transport.flush)
        .map(transport => transport.flush?.())
    );
  }

  /**
   * Log a performance metric
   */
  public performance(message: string, duration: number, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    userId?: string;
    sessionId?: string;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.PERFORMANCE;
    if (!this.shouldLog(LogLevel.INFO, category)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, {
      ...options,
      category,
      duration,
    });
    
    this.processLogEntry(entry);
  }

  /**
   * Log methods for different levels
   */
  public debug(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.SYSTEM;
    if (!this.shouldLog(LogLevel.DEBUG, category)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, options);
    this.processLogEntry(entry);
  }

  public info(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.SYSTEM;
    if (!this.shouldLog(LogLevel.INFO, category)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, options);
    this.processLogEntry(entry);
  }

  public warn(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.SYSTEM;
    if (!this.shouldLog(LogLevel.WARNING, category)) return;
    
    const entry = this.createLogEntry(LogLevel.WARNING, message, options);
    this.processLogEntry(entry);
  }

  public error(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.SYSTEM;
    if (!this.shouldLog(LogLevel.ERROR, category)) return;
    
    const entry = this.createLogEntry(LogLevel.ERROR, message, options);
    this.processLogEntry(entry);
  }

  public critical(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.SYSTEM;
    if (!this.shouldLog(LogLevel.CRITICAL, category)) return;
    
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, options);
    this.processLogEntry(entry);
  }
}

/**
 * Helper function to get the logger instance
 */
export function getLogger(): LoggerService {
  return LoggerService.getInstance();
}
