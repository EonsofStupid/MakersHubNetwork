
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

interface LogDetails {
  source?: string;
  details?: Record<string, any>;
  tags?: string[];
}

/**
 * Logger service
 * Provides logging functionality with levels and categories
 */
class LoggerService {
  private enabled = true;
  private minLevel = LogLevel.INFO;
  
  /**
   * Log a message
   */
  log(level: LogLevel, category: LogCategory, message: string, logDetails?: LogDetails): void {
    if (!this.enabled || this.getLevelValue(level) < this.getLevelValue(this.minLevel)) {
      return;
    }
    
    const details = logDetails?.details || {};
    const source = logDetails?.source || 'app';
    const tags = logDetails?.tags || [];
    
    const timestamp = new Date().toISOString();
    
    // Build log entry
    const logEntry = {
      level,
      category,
      message,
      details,
      source,
      tags,
      timestamp
    };
    
    // Log to console with appropriate styling
    this.consoleLog(logEntry);
    
    // Here you would also send logs to any configured transports
    // this.sendToTransports(logEntry);
  }
  
  /**
   * Debug level log
   */
  debug(message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, LogCategory.APP, message, details);
  }
  
  /**
   * Info level log
   */
  info(message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, LogCategory.APP, message, details);
  }
  
  /**
   * Warning level log
   */
  warn(message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, LogCategory.APP, message, details);
  }
  
  /**
   * Error level log
   */
  error(message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, LogCategory.APP, message, details);
  }
  
  /**
   * Set the minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Get the numeric value of a log level for comparison
   */
  private getLevelValue(level: LogLevel): number {
    const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.TRACE]: 1,
      [LogLevel.INFO]: 2,
      [LogLevel.SUCCESS]: 3,
      [LogLevel.WARN]: 4,
      [LogLevel.ERROR]: 5,
      [LogLevel.CRITICAL]: 6,
      [LogLevel.FATAL]: 7,
      [LogLevel.SILENT]: 8,
    };
    
    return LOG_LEVEL_VALUES[level] || 0;
  }
  
  /**
   * Log to console with appropriate styling
   */
  private consoleLog(logEntry: any): void {
    const { level, category, message, details, source, timestamp } = logEntry;
    
    // Define colors for different log levels
    const levelColors: Record<string, string> = {
      [LogLevel.DEBUG]: '#6b7280', // gray-500
      [LogLevel.TRACE]: '#9ca3af', // gray-400
      [LogLevel.INFO]: '#3b82f6', // blue-500
      [LogLevel.SUCCESS]: '#10b981', // green-500
      [LogLevel.WARN]: '#f59e0b', // amber-500
      [LogLevel.ERROR]: '#ef4444', // red-500
      [LogLevel.CRITICAL]: '#b91c1c', // red-700
      [LogLevel.FATAL]: '#7f1d1d', // red-900
    };
    
    // Set message color based on log level
    const color = levelColors[level] || '#6b7280';
    
    // Format timestamp to be more readable
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    
    // Log to console with appropriate colors
    console.log(
      `%c${formattedTime}%c [${level.toUpperCase()}] %c[${category}]%c ${source}: %c${message}`,
      'color: #9ca3af', // gray timestamp
      `color: ${color}; font-weight: bold;`, // level with color
      'color: #8b5cf6; font-weight: bold;', // purple category
      'color: #6b7280', // gray source
      'color: #111827', // black message
      details
    );
  }
}

// Export singleton instance
export const logger = new LoggerService();
