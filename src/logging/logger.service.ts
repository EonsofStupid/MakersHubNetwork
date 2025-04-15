
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

/**
 * Logger service for application-wide logging
 */
class LoggerService {
  private static instance: LoggerService;
  private logLevel: LogLevel = LogLevel.INFO;
  private enabledCategories: Set<LogCategory> = new Set(Object.values(LogCategory));
  private listeners: ((level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => void)[] = [];
  
  /**
   * Get singleton instance
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }
  
  /**
   * Set minimum log level
   */
  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  /**
   * Enable specific log categories
   */
  public enableCategories(categories: LogCategory[]): void {
    categories.forEach(category => this.enabledCategories.add(category));
  }
  
  /**
   * Disable specific log categories
   */
  public disableCategories(categories: LogCategory[]): void {
    categories.forEach(category => this.enabledCategories.delete(category));
  }
  
  /**
   * Add log listener
   */
  public addListener(listener: (level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Remove log listener
   */
  public removeListener(listener: (level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  /**
   * Log a message
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    // Check if this log should be processed
    if (!this.shouldLog(level, category)) {
      return;
    }
    
    // Format the log message
    const timestamp = new Date().toISOString();
    const formattedMsg = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;
    
    // Log to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMsg, details);
        break;
      case LogLevel.INFO:
        console.info(formattedMsg, details);
        break;
      case LogLevel.WARN:
        console.warn(formattedMsg, details);
        break;
      case LogLevel.ERROR:
        console.error(formattedMsg, details);
        break;
    }
    
    // Notify listeners
    this.notifyListeners(level, category, message, details);
  }
  
  /**
   * Check if this log should be processed based on level and category
   */
  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    const levelPriority: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3
    };
    
    // Check log level
    if (levelPriority[level] < levelPriority[this.logLevel]) {
      return false;
    }
    
    // Check category
    if (!this.enabledCategories.has(category)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Notify all listeners
   */
  private notifyListeners(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    this.listeners.forEach(listener => {
      try {
        listener(level, category, message, details);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }
}

export const logger = LoggerService.getInstance();
