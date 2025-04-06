
import { LogEntry, LogLevel, LogTransport } from '../types';

interface UITransportOptions {
  maxEntries?: number;
  enabled?: boolean;
  minLevel?: LogLevel;
  includeDebug?: boolean;
}

export class UITransport implements LogTransport {
  id: string;
  name: string;
  enabled: boolean;
  private logs: LogEntry[];
  private maxEntries: number;
  private subscribers: ((entries: LogEntry[]) => void)[];
  private minLevel: LogLevel;
  private includeDebug: boolean;

  constructor(options: UITransportOptions = {}) {
    this.id = 'ui-transport';
    this.name = 'UI Transport';
    this.enabled = options.enabled ?? true;
    this.maxEntries = options.maxEntries ?? 100;
    this.minLevel = options.minLevel ?? LogLevel.DEBUG;
    this.includeDebug = options.includeDebug ?? true;
    this.logs = [];
    this.subscribers = [];
  }

  log(entry: LogEntry): void {
    if (!this.enabled) return;

    // Filter by log level
    if (entry.level < this.minLevel) return;

    // Optional debug filtering
    if (!this.includeDebug && entry.level === LogLevel.DEBUG) return;
    
    // Add log entry
    this.logs.push(entry);
    
    // Trim logs if they exceed max entries
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(-this.maxEntries);
    }
    
    // Notify subscribers
    this.notifySubscribers();
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
    this.notifySubscribers();
  }

  subscribe(callback: (entries: LogEntry[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Immediately call with current logs
    callback([...this.logs]);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    const logs = [...this.logs];
    this.subscribers.forEach(callback => callback(logs));
  }

  flush(): Promise<void> {
    return Promise.resolve();
  }
}
