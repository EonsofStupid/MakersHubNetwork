
import { LogCategory, LogLevel, LogEntry, LogDetails } from '@/shared/types/shared.types';
import { v4 as uuidv4 } from 'uuid';

class LoggerService {
  private logEntries: LogEntry[] = [];
  private maxEntries: number = 1000;
  private consoleEnabled: boolean = true;
  private memoryEnabled: boolean = true;
  
  /**
   * Log an entry with specified level and category
   */
  public log(level: LogLevel, category: LogCategory, message: string | Record<string, unknown>, details?: LogDetails): void {
    const timestamp = new Date().toISOString();
    const id = uuidv4();
    const source = details?.source || 'unknown';
    
    const logEntry: LogEntry = {
      id,
      level,
      category,
      message,
      details,
      timestamp,
      source
    };
    
    // Store in memory
    if (this.memoryEnabled) {
      this.logEntries.push(logEntry);
      
      // Trim if exceeds max entries
      if (this.logEntries.length > this.maxEntries) {
        this.logEntries = this.logEntries.slice(-this.maxEntries);
      }
    }
    
    // Console output
    if (this.consoleEnabled) {
      this.outputToConsole(logEntry);
    }
  }
  
  /**
   * Print log entry to console
   */
  private outputToConsole(entry: LogEntry): void {
    const { level, category, message, timestamp, source, details } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}] [${source}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        console.error(prefix, message, details || '');
        break;
      default:
        console.log(prefix, message, details || '');
    }
  }
  
  /**
   * Get all stored log entries
   */
  public getLogs(filter?: { category?: LogCategory; level?: LogLevel; source?: string }): LogEntry[] {
    if (!filter) {
      return [...this.logEntries];
    }
    
    return this.logEntries.filter(entry => {
      const categoryMatch = !filter.category || entry.category === filter.category;
      const levelMatch = !filter.level || entry.level === filter.level;
      const sourceMatch = !filter.source || entry.source === filter.source;
      
      return categoryMatch && levelMatch && sourceMatch;
    });
  }
  
  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logEntries = [];
  }
  
  /**
   * Configure logger options
   */
  public configure(options: { consoleEnabled?: boolean; memoryEnabled?: boolean; maxEntries?: number }): void {
    if (options.consoleEnabled !== undefined) {
      this.consoleEnabled = options.consoleEnabled;
    }
    
    if (options.memoryEnabled !== undefined) {
      this.memoryEnabled = options.memoryEnabled;
    }
    
    if (options.maxEntries !== undefined && options.maxEntries > 0) {
      this.maxEntries = options.maxEntries;
    }
  }
}

// Export a singleton instance
export const logger = new LoggerService();
