
import { LogEntry, LogCategory, LogLevel, LogEventCallback } from './types';
import { consoleTransport } from './transports/console.transport';
import { memoryTransport } from './transports/memory.transport';
import { logEventEmitter } from './events/LogEventEmitter';

class LoggingSystem {
  private static instance: LoggingSystem;
  private initialized: boolean = false;
  private transports: any[] = [consoleTransport, memoryTransport];
  
  private constructor() {
    // Private constructor to enforce singleton
  }
  
  public static getInstance(): LoggingSystem {
    if (!LoggingSystem.instance) {
      LoggingSystem.instance = new LoggingSystem();
    }
    return LoggingSystem.instance;
  }
  
  public initialize(): void {
    if (this.initialized) {
      console.warn('Logging system already initialized');
      return;
    }
    
    console.log('Initializing logging system...');
    this.initialized = true;
  }
  
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  public log(level: LogLevel, message: string, options?: { 
    category?: LogCategory;
    source?: string;
    details?: any;
  }): void {
    if (!this.initialized) {
      console.warn('Logging system not initialized');
      this.initialize();
    }
    
    const timestamp = new Date();
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp,
      level,
      message,
      category: options?.category || LogCategory.GENERAL,
      source: options?.source || 'unknown',
      details: options?.details || null
    };
    
    // Send to all transports
    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
    
    // Emit log event for real-time logging
    try {
      logEventEmitter.emitLogEvent(entry);
    } catch (error) {
      console.error('Error emitting log event:', error);
    }
  }
  
  public info(message: string, options?: { 
    category?: LogCategory;
    source?: string;
    details?: any;
  }): void {
    this.log(LogLevel.INFO, message, options);
  }
  
  public warn(message: string, options?: { 
    category?: LogCategory;
    source?: string;
    details?: any;
  }): void {
    this.log(LogLevel.WARN, message, options);
  }
  
  public error(message: string, options?: { 
    category?: LogCategory;
    source?: string;
    details?: any;
  }): void {
    this.log(LogLevel.ERROR, message, options);
  }
  
  public debug(message: string, options?: { 
    category?: LogCategory;
    source?: string;
    details?: any;
  }): void {
    this.log(LogLevel.DEBUG, message, options);
  }
  
  public registerLogEventCallback(callback: LogEventCallback): () => void {
    return logEventEmitter.onLog(callback);
  }
  
  public getLogs(): LogEntry[] {
    return memoryTransport.getLogs();
  }
  
  public clearLogs(): void {
    memoryTransport.clearLogs();
  }
  
  public getLogCount(): number {
    return memoryTransport.getLogCount();
  }
}

// Export a singleton instance
export const loggingSystem = LoggingSystem.getInstance();
