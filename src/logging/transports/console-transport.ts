
import { LogEntry, LogTransport, LogCategory, LogLevel, LogFilterOptions } from '../types';

/**
 * Transport for logging to the console
 */
export class ConsoleTransport implements LogTransport {
  private options: { minLevel?: LogLevel } = {};
  
  constructor(options: { minLevel?: LogLevel } = {}) {
    this.options = options;
  }
  
  /**
   * Log entry to console
   */
  log(entry: LogEntry): void {
    const { level, message, category, source, details } = entry;
    
    // Format message prefix
    const prefix = `[${level.toUpperCase()}]${category ? ` (${category})` : ''}${source ? ` ${source}` : ''}:`;
    
    // Log with appropriate console method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, details || '');
        break;
      case LogLevel.TRACE:
        console.trace(prefix, message, details || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.SUCCESS:
        console.info(prefix, message, details || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, message, details || '');
        break;
    }
  }
  
  /**
   * Check if this transport supports the given log level & category
   */
  supports(level: LogLevel, category?: LogCategory): boolean {
    // Always support all categories
    // Check if level is at or above the minimum level
    if (this.options.minLevel) {
      const levels = Object.values(LogLevel);
      const minLevelIndex = levels.indexOf(this.options.minLevel);
      const currentLevelIndex = levels.indexOf(level);
      
      return currentLevelIndex >= minLevelIndex;
    }
    
    return true;
  }
}
