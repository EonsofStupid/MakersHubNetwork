
import { LogLevel, LogCategory, LogEntry, LogFilter } from '@/shared/types/shared.types';
import { LogBridge } from '@/logging/bridge';

/**
 * Logger service
 * Provides a centralized logging service for the application
 */
class LoggerService {
  /**
   * Log a message with a specific level and category
   * @param level The log level
   * @param category The log category
   * @param message The log message
   * @param details Additional log details
   */
  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>): void {
    LogBridge.log(level, category, message, details);
  }
  
  /**
   * Log a debug message
   * @param category The log category
   * @param message The log message
   * @param details Additional log details
   */
  debug(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }
  
  /**
   * Log an info message
   * @param category The log category
   * @param message The log message
   * @param details Additional log details
   */
  info(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.INFO, category, message, details);
  }
  
  /**
   * Log a warning message
   * @param category The log category
   * @param message The log message
   * @param details Additional log details
   */
  warn(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.WARN, category, message, details);
  }
  
  /**
   * Log an error message
   * @param category The log category
   * @param message The log message
   * @param details Additional log details
   */
  error(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.ERROR, category, message, details);
  }
  
  /**
   * Log a success message
   * @param category The log category
   * @param message The log message
   * @param details Additional log details
   */
  success(category: LogCategory, message: string, details?: Record<string, any>): void {
    this.log(LogLevel.SUCCESS, category, message, details);
  }
  
  /**
   * Get all logs
   * @param filter Optional filter to apply
   * @returns Array of log entries
   */
  getLogs(filter?: LogFilter): LogEntry[] {
    return LogBridge.getLogs(filter);
  }
  
  /**
   * Clear all logs
   */
  clearLogs(): void {
    LogBridge.clearLogs();
  }
  
  /**
   * Subscribe to new logs
   * @param callback The callback function to call when a new log is added
   * @returns A function to unsubscribe
   */
  onNewLog(callback: (log: LogEntry) => void): { unsubscribe: () => void } {
    return LogBridge.onNewLog(callback);
  }
  
  /**
   * Get logging statistics
   * @returns Statistics about the logs
   */
  getStats() {
    return LogBridge.getStats();
  }
}

// Create a singleton instance
export const logger = new LoggerService();
