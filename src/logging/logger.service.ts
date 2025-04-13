
import { v4 as uuidv4 } from 'uuid';
import { 
  LogLevel, 
  LogCategory, 
  LogDetails, 
  LogEntry 
} from '@/shared/types/shared.types';

class Logger {
  private listeners: Array<(entry: LogEntry) => void> = [];
  private config = {
    minLevel: LogLevel.DEBUG,
    enabled: true,
    defaultCategory: LogCategory.SYSTEM
  };

  log(
    level: LogLevel,
    message: string | Record<string, unknown>,
    category = this.config.defaultCategory,
    details?: Record<string, unknown>
  ) {
    if (!this.config.enabled) return;

    const entry: LogEntry = {
      id: uuidv4(),
      level,
      category,
      message,
      details,
      timestamp: new Date().toISOString(),
      source: details?.source as string || 'app'
    };

    this.emit(entry);
  }

  private emit(entry: LogEntry) {
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Error in log listener', error);
      }
    });
    
    // Also output to console for development
    this.outputToConsole(entry);
  }

  private outputToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `${timestamp} [${entry.level}] [${entry.category}] [${entry.source}]:`;
    const detailsStr = entry.details 
      ? `\n${JSON.stringify(entry.details, null, 2)}`
      : '';

    switch (entry.level) {
      case LogLevel.TRACE:
        console.trace(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case LogLevel.SUCCESS:
        console.log(`%c${prefix} ${entry.message}`, 'color: green', detailsStr);
        break;
      default:
        console.log(`${prefix} ${entry.message}${detailsStr}`);
    }
  }

  addListener(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setConfig(config: Partial<typeof this.config>) {
    this.config = {
      ...this.config,
      ...config
    };
  }

  // Convenience methods for different log levels
  trace(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.TRACE, message, category, details);
  }

  debug(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, category, details);
  }

  info(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, category, details);
  }

  warn(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, category, details);
  }

  error(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, category, details);
  }

  fatal(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.FATAL, message, category, details);
  }

  success(message: string, category = LogCategory.SYSTEM, details?: Record<string, unknown>) {
    this.log(LogLevel.SUCCESS, message, category, details);
  }
}

// Create singleton instance
export const logger = new Logger();
