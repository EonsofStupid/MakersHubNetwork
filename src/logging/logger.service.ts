
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/shared.types';

class Logger {
  private transports: Array<(entry: LogEntry) => void> = [];

  constructor() {
    // Initialize with console transport by default
    this.addTransport((entry: LogEntry) => {
      const { level, category, message, timestamp, source, details } = entry;
      
      const formattedTimestamp = timestamp instanceof Date 
        ? timestamp.toISOString()
        : new Date(timestamp).toISOString();
      
      const logPrefix = `[${formattedTimestamp}] [${category}] [${level}]${source ? ` [${source}]` : ''}`;
      
      switch (level) {
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(`${logPrefix} ${message}`, details || '');
          break;
        case LogLevel.WARN:
          console.warn(`${logPrefix} ${message}`, details || '');
          break;
        case LogLevel.INFO:
          console.info(`${logPrefix} ${message}`, details || '');
          break;
        case LogLevel.DEBUG:
        case LogLevel.TRACE:
        default:
          console.log(`${logPrefix} ${message}`, details || '');
          break;
      }
    });
  }

  addTransport(transport: (entry: LogEntry) => void) {
    this.transports.push(transport);
  }

  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      category,
      message,
      timestamp: new Date(),
      details
    };

    this.transports.forEach(transport => {
      try {
        transport(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
  }

  debug(category: LogCategory, message: string, details?: Record<string, any>) {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  info(category: LogCategory, message: string, details?: Record<string, any>) {
    this.log(LogLevel.INFO, category, message, details);
  }

  warn(category: LogCategory, message: string, details?: Record<string, any>) {
    this.log(LogLevel.WARN, category, message, details);
  }

  error(category: LogCategory, message: string, details?: Record<string, any>) {
    this.log(LogLevel.ERROR, category, message, details);
  }

  trace(category: LogCategory, message: string, details?: Record<string, any>) {
    this.log(LogLevel.TRACE, category, message, details);
  }

  fatal(category: LogCategory, message: string, details?: Record<string, any>) {
    this.log(LogLevel.FATAL, category, message, details);
  }
}

// Export a singleton instance
export const logger = new Logger();
