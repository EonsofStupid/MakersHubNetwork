import { LogEntry, LogFilter, LogLevel, TransportOptions, Transport } from '../types';

export class MemoryTransport implements Transport {
  private logs: LogEntry[] = [];
  private minLogLevel: LogLevel = LogLevel.INFO;
  private maxEntries: number;

  constructor(options?: TransportOptions) {
    this.minLogLevel = options?.minLevel || LogLevel.INFO;
    this.maxEntries = options?.maxEntries || 1000;
  }

  log(entry: LogEntry): void {
    if (this.logs.length >= this.maxEntries) {
      this.logs.shift(); // Remove the oldest entry
    }
    this.logs.push(entry);
  }

  // Implement required Transport interface methods
  setMinLevel(level: LogLevel): void {
    this.minLogLevel = level;
  }

  getMinLevel(): LogLevel {
    return this.minLogLevel;
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  filterLogs(filter: LogFilter): LogEntry[] {
    let filteredLogs = this.logs;

    if (filter.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filter.level);
    }

    if (filter.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filter.category);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchTerm) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm)) ||
        (log.source && log.source.toLowerCase().includes(searchTerm))
      );
    }

    if (filter.startTime) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filter.startTime!);
    }

    if (filter.endTime) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= filter.endTime!);
    }

    if (filter.source) {
      filteredLogs = filteredLogs.filter(log => log.source === filter.source);
    }

    return filteredLogs;
  }

  clear(): void {
    this.logs = [];
  }
}
