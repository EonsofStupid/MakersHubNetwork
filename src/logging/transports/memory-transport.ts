import { LogTransport, LogEntry, LogLevel, LogFilter } from '../logger.service';

export interface TransportOptions {
  maxEntries?: number;
  minLevel?: LogLevel;
}

export class MemoryTransport implements LogTransport {
  name = 'memory';
  private logs: LogEntry[] = [];
  private listeners: ((event: any) => void)[] = [];
  
  constructor(private options: TransportOptions = {}) {}
  
  log(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Limit the number of entries
    if (this.options.maxEntries && this.logs.length > this.options.maxEntries) {
      this.logs.shift();
    }
    
    this.notifyListeners({
      type: 'new-log',
      data: entry
    });
  }
  
  subscribe(listener: (event: any) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners(event: any): void {
    this.listeners.forEach(listener => listener(event));
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  filter(options?: Partial<LogFilter>): LogEntry[] {
    let entries = [...this.logs];
    
    if (options?.level) {
      entries = entries.filter(log => log.level === options.level);
    }
    
    if (options?.category) {
      entries = entries.filter(log => log.category === options.category);
    }

    if (options?.source) {
      entries = entries.filter(log => log.source && log.source.includes(options.source as string));
    }
    
    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      entries = entries.filter(log =>
        log.message.toLowerCase().includes(searchTerm) ||
        (log.source && log.source.toLowerCase().includes(searchTerm)) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm))
      );
    }
    
    if (options?.from) {
      entries = entries.filter(log => log.timestamp >= options.from!);
    }
    
    if (options?.to) {
      entries = entries.filter(log => log.timestamp <= options.to!);
    }
    
    return entries;
  }

  clearLogs(): void {
    this.logs = [];
    this.notifyListeners({
      type: 'logs-cleared',
      data: null
    });
  }
}
