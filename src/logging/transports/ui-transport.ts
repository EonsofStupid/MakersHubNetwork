
import { LogEntry, LogLevel } from '@/shared/types';
import { LogTransport } from '@/logging/types';

/**
 * Transport for sending logs to UI components (like toast notifications)
 */
export class UITransport implements LogTransport {
  private currentLevel: LogLevel = LogLevel.INFO;
  private listeners: ((entry: LogEntry) => void)[] = [];

  constructor(level: LogLevel = LogLevel.INFO) {
    this.currentLevel = level;
  }

  /**
   * Set the minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Log an entry
   */
  log(entry: LogEntry): void {
    // Only log if the entry level is greater than or equal to the current level
    if (this.shouldLog(entry.level)) {
      this.notifyListeners(entry);
    }
  }

  /**
   * Add a listener for log entries
   */
  addListener(listener: (entry: LogEntry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of a new log entry
   */
  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }

  /**
   * Determine if an entry should be logged based on its level
   */
  private shouldLog(level: LogLevel): boolean {
    const levelValues: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.SUCCESS]: 2,
      [LogLevel.WARN]: 3,
      [LogLevel.ERROR]: 4,
      [LogLevel.CRITICAL]: 5,
      [LogLevel.FATAL]: 6,
      [LogLevel.TRACE]: -1
    };

    return levelValues[level] >= levelValues[this.currentLevel];
  }
}
