
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
    minLevel: 'debug' as LogLevel,
    enabled: true,
    defaultCategory: 'system' as LogCategory
  };

  log(
    level: string,
    message: string | Record<string, unknown>,
    category = this.config.defaultCategory,
    details?: Record<string, unknown>
  ) {
    if (!this.config.enabled) return;

    const entry: LogEntry = {
      id: uuidv4(),
      level: level as LogLevel,
      category: category as LogCategory,
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
      case 'trace':
        console.trace(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case 'debug':
        console.debug(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case 'info':
        console.info(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case 'error':
      case 'fatal':
        console.error(`${prefix} ${entry.message}${detailsStr}`);
        break;
      case 'success':
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
  trace(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('trace', message, category, details);
  }

  debug(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('debug', message, category, details);
  }

  info(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('info', message, category, details);
  }

  warn(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('warn', message, category, details);
  }

  error(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('error', message, category, details);
  }

  fatal(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('fatal', message, category, details);
  }

  success(message: string, category = 'system', details?: Record<string, unknown>) {
    this.log('success', message, category, details);
  }
}

// Create singleton instance
export const logger = new Logger();
