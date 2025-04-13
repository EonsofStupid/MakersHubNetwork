
import { LogLevel, LogCategory, LogEntry, LogFilter, LogEvent } from '@/shared/types/shared.types';

/**
 * LogBridge Interface
 * Provides a clean abstraction for logging across the application
 */
export interface ILogBridge {
  // Core logging methods
  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>): void;
  debug(category: LogCategory, message: string, details?: Record<string, any>): void;
  info(category: LogCategory, message: string, details?: Record<string, any>): void;
  warn(category: LogCategory, message: string, details?: Record<string, any>): void;
  error(category: LogCategory, message: string, details?: Record<string, any>): void;
  
  // Configuration
  setMinLevel(level: LogLevel): void;
  enableCategory(category: LogCategory): void;
  disableCategory(category: LogCategory): void;
  
  // Query logs
  getLogs(filter?: LogFilter): LogEntry[];
  clearLogs(): void;
  
  // Event handling
  onNewLog(callback: (log: LogEntry) => void): { unsubscribe: () => void };
  
  // Utilities
  getStats(): { totalLogs: number; byLevel: Record<LogLevel, number>; byCategory: Record<LogCategory, number> };
}

/**
 * LogBridge Implementation
 * Concrete implementation of the LogBridge interface
 */
export class LogBridgeImpl implements ILogBridge {
  private logs: LogEntry[] = [];
  private minLevel: LogLevel = LogLevel.INFO;
  private enabledCategories: Set<LogCategory> = new Set(Object.values(LogCategory));
  private logListeners: ((log: LogEntry) => void)[] = [];
  
  // Helper method to check if a log should be recorded
  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    const levelValue = this.getLevelValue(level);
    const minLevelValue = this.getLevelValue(this.minLevel);
    
    return levelValue >= minLevelValue && this.enabledCategories.has(category);
  }
  
  // Helper method to get log level value
  private getLevelValue(level: LogLevel): number {
    const levelValues: Record<LogLevel, number> = {
      [LogLevel.TRACE]: 0,
      [LogLevel.DEBUG]: 1,
      [LogLevel.INFO]: 2,
      [LogLevel.SUCCESS]: 3,
      [LogLevel.WARN]: 4,
      [LogLevel.ERROR]: 5,
      [LogLevel.FATAL]: 6,
      [LogLevel.CRITICAL]: 7,
      [LogLevel.SILENT]: 8,
    };
    
    return levelValues[level] || 2; // Default to INFO level value
  }
  
  // Helper method to generate a log ID
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  // Helper method to notify listeners about a new log
  private notifyListeners(log: LogEntry): void {
    this.logListeners.forEach(listener => {
      try {
        listener(log);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }
  
  // Helper method to log to console in development
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
  
  // Core logging methods
  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>): void {
    if (!this.shouldLog(level, category)) {
      return;
    }
    
    const logEntry: LogEntry = {
      id: this.generateLogId(),
      level,
      category,
      message,
      timestamp: new Date(),
      source: details?.source,
      details: details?.details,
      tags: details?.tags,
    };
    
    this.logs.push(logEntry);
    this.notifyListeners(logEntry);
    
    // Also log to console for development
    this.logToConsole(logEntry);
  }
  
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
  
  // Configuration
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  enableCategory(category: LogCategory): void {
    this.enabledCategories.add(category);
  }
  
  disableCategory(category: LogCategory): void {
    this.enabledCategories.delete(category);
  }
  
  // Query logs
  getLogs(filter?: LogFilter): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (filter) {
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      
      if (filter.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filter.category);
      }
      
      if (filter.source) {
        filteredLogs = filteredLogs.filter(log => log.source && log.source.includes(filter.source || ''));
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.message.toLowerCase().includes(searchLower) ||
          (log.source && log.source.toLowerCase().includes(searchLower))
        );
      }
      
      if (filter.from) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.from!);
      }
      
      if (filter.to) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.to!);
      }
    }
    
    return filteredLogs;
  }
  
  clearLogs(): void {
    this.logs = [];
  }
  
  // Event handling
  onNewLog(callback: (log: LogEntry) => void): { unsubscribe: () => void } {
    this.logListeners.push(callback);
    
    return {
      unsubscribe: () => {
        const index = this.logListeners.indexOf(callback);
        if (index !== -1) {
          this.logListeners.splice(index, 1);
        }
      }
    };
  }
  
  // Utilities
  getStats(): { totalLogs: number; byLevel: Record<LogLevel, number>; byCategory: Record<LogCategory, number> } {
    const byLevel: Record<LogLevel, number> = Object.values(LogLevel).reduce((acc, level) => {
      acc[level] = 0;
      return acc;
    }, {} as Record<LogLevel, number>);
    
    const byCategory: Record<LogCategory, number> = Object.values(LogCategory).reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<LogCategory, number>);
    
    this.logs.forEach(log => {
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
    });
    
    return {
      totalLogs: this.logs.length,
      byLevel,
      byCategory
    };
  }
}

// Create a singleton instance
export const LogBridge: ILogBridge = new LogBridgeImpl();
