
import { LogEntry, LogLevel, LogFilter } from '@/shared/types/shared.types';

/**
 * In-memory transport for storing and retrieving logs
 */
export class MemoryTransport {
  private logs: LogEntry[] = [];
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(options: { maxEntries?: number } = {}) {
    this.maxEntries = options.maxEntries || 1000;
  }

  private maxEntries: number;

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  log(entry: LogEntry): void {
    // Filter by level
    if (this.shouldSkipLog(entry.level)) {
      return;
    }

    this.logs.push(entry);

    // Trim logs if they exceed maxEntries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(this.logs.length - this.maxEntries);
    }
  }

  private shouldSkipLog(level: LogLevel): boolean {
    const levelValues: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
      [LogLevel.CRITICAL]: 4,
      [LogLevel.FATAL]: 5,
      [LogLevel.TRACE]: -1,
      [LogLevel.SUCCESS]: 2,
      [LogLevel.SILENT]: 100,
    };

    return levelValues[level] < levelValues[this.minLevel];
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getFilteredLogs(filter: LogFilter = {}): LogEntry[] {
    return this.logs.filter((entry) => {
      // Filter by level
      if (filter.level && entry.level !== filter.level) {
        return false;
      }

      // Filter by category
      if (filter.category && entry.category !== filter.category) {
        return false;
      }

      // Filter by time range
      if (filter.from && entry.timestamp < (typeof filter.from === 'number' ? filter.from : filter.from.getTime())) {
        return false;
      }

      if (filter.to && entry.timestamp > (typeof filter.to === 'number' ? filter.to : filter.to.getTime())) {
        return false;
      }

      // Filter by search term
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        const messageContains = entry.message.toLowerCase().includes(searchTerm);
        const sourceContains = entry.source && entry.source.toLowerCase().includes(searchTerm);
        return messageContains || sourceContains;
      }

      return true;
    });
  }

  clear(): void {
    this.logs = [];
  }
}
