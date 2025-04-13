
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/shared.types';

// Basic logger interface
interface Logger {
  log: (level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>) => void;
  debug: (category: LogCategory, message: string, details?: Record<string, any>) => void;
  info: (category: LogCategory, message: string, details?: Record<string, any>) => void;
  warn: (category: LogCategory, message: string, details?: Record<string, any>) => void;
  error: (category: LogCategory, message: string, details?: Record<string, any>) => void;
}

// Simple implementation of the logger
class LoggerService implements Logger {
  private logs: LogEntry[] = [];
  
  // Main logging method
  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>): void {
    const logEntry: LogEntry = {
      level,
      category,
      message,
      timestamp: new Date(),
      source: details?.source,
      details: details,
    };
    
    this.logs.push(logEntry);
    
    // Also log to console in development
    this.logToConsole(logEntry);
  }
  
  // Helper methods for specific log levels
  debug(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }
  
  info(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.INFO, category, message, details);
  }
  
  warn(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.WARN, category, message, details);
  }
  
  error(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.ERROR, category, message, details);
  }
  
  // Console logging helper
  private logToConsole(log: LogEntry): void {
    const prefix = `[${log.category}]`;
    
    switch (log.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, log.message, log.details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, log.message, log.details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, log.message, log.details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
      case LogLevel.CRITICAL:
        console.error(prefix, log.message, log.details || '');
        break;
      default:
        console.log(prefix, log.message, log.details || '');
        break;
    }
  }
  
  // Get all logs
  getLogs(): LogEntry[] {
    return this.logs;
  }
  
  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }
}

// Create a singleton instance
export const logger = new LoggerService();

// Export a function to get the logger instance
export const getLogger = () => logger;
