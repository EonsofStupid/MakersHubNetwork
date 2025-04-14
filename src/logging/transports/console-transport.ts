
import { LogEntry, LogLevel, LOG_LEVEL_VALUES } from '@/shared/types';
import { LogTransport } from '@/logging/types';

/**
 * Console transport for logging to browser console
 */
export class ConsoleTransport implements LogTransport {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  /**
   * Set the minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Log an entry to the console
   */
  log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const { level, message, category, details, timestamp } = entry;
    const time = new Date(timestamp).toISOString();
    const color = this.getColorForLevel(level);
    
    const categoryDisplay = category ? `[${category.toUpperCase()}]` : '';
    const formattedMessage = `${time} ${categoryDisplay} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`%c${formattedMessage}`, `color: ${color}`, details);
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(`%c${formattedMessage}`, `color: ${color}`, details);
        break;
      case LogLevel.WARN:
        console.warn(`%c${formattedMessage}`, `color: ${color}`, details);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        console.error(`%c${formattedMessage}`, `color: ${color}`, details);
        break;
      case LogLevel.TRACE:
        console.trace(`%c${formattedMessage}`, `color: ${color}`, details);
        break;
      default:
        console.log(`%c${formattedMessage}`, `color: ${color}`, details);
    }
  }

  /**
   * Determine if an entry should be logged based on the minimum level
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.minLevel];
  }

  /**
   * Get an appropriate color for each log level
   */
  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '#8a8a8a'; // Gray
      case LogLevel.INFO:
        return '#2980b9'; // Blue
      case LogLevel.SUCCESS:
        return '#27ae60'; // Green
      case LogLevel.WARN:
        return '#f39c12'; // Orange
      case LogLevel.ERROR:
        return '#e74c3c'; // Red
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        return '#c0392b'; // Dark Red
      case LogLevel.TRACE:
        return '#9b59b6'; // Purple
      default:
        return 'inherit';
    }
  }
}
