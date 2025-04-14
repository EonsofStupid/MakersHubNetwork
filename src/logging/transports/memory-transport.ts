
import { LogEntry, LogLevel, LogFilter } from '@/shared/types';
import { LogTransport } from '@/logging/types';

/**
 * Memory transport for storing logs in memory
 */
export class MemoryTransport implements LogTransport {
  private entries: LogEntry[] = [];
  private maxEntries: number;
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO, maxEntries = 1000) {
    this.minLevel = minLevel;
    this.maxEntries = maxEntries;
  }

  /**
   * Set the minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Log an entry to memory
   */
  log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    this.entries.push(entry);
    this.pruneEntries();
  }

  /**
   * Get filtered entries from memory
   */
  getEntries(filter?: LogFilter): LogEntry[] {
    if (!filter) {
      return [...this.entries].reverse();
    }

    return [...this.entries]
      .filter((entry) => {
        if (filter.level && entry.level !== filter.level) {
          return false;
        }
        if (filter.category && entry.category !== filter.category) {
          return false;
        }
        if (filter.source && entry.source !== filter.source) {
          return false;
        }
        if (filter.search) {
          const searchTerm = filter.search.toLowerCase();
          const messageMatches = entry.message.toLowerCase().includes(searchTerm);
          const sourceMatches = entry.source?.toLowerCase().includes(searchTerm) || false;
          if (!messageMatches && !sourceMatches) {
            return false;
          }
        }
        if (filter.startTime !== undefined && entry.timestamp < filter.startTime) {
          return false;
        }
        if (filter.endTime !== undefined && entry.timestamp > filter.endTime) {
          return false;
        }
        if (filter.from !== undefined) {
          const fromTimestamp = filter.from instanceof Date ? filter.from.getTime() : filter.from;
          if (entry.timestamp < fromTimestamp) {
            return false;
          }
        }
        if (filter.to !== undefined) {
          const toTimestamp = filter.to instanceof Date ? filter.to.getTime() : filter.to;
          if (entry.timestamp > toTimestamp) {
            return false;
          }
        }
        return true;
      })
      .reverse();
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * Prune entries if over maximum
   */
  private pruneEntries(): void {
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  /**
   * Determine if an entry should be logged based on the minimum level
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

    return levelValues[level] >= levelValues[this.minLevel];
  }
}
