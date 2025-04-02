
import { v4 as uuidv4 } from 'uuid';
import { 
  LogCategory, 
  LogEntry, 
  LoggingConfig, 
  LogLevel,
  LoggerOptions
} from '../types';
import { isRecord } from '@/shared/utils/type-guards';

/**
 * Core logger functionality without any UI or external dependencies
 */
export class LoggerCore {
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
    options?: LoggerOptions
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
