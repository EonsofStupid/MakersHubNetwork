
import { LogEntry, LogLevel, LogTransport } from '../types';
import { BehaviorSubject } from 'rxjs';

/**
 * UI transport for logging
 */
export class UITransport implements LogTransport {
  id: string = 'ui';
  name: string = 'UI Logger';
  enabled: boolean = true;
  private logs: LogEntry[] = [];
  private maxEntries: number = 100;
  private logsSubject = new BehaviorSubject<LogEntry[]>([]);
  private levelFilter: LogLevel | null = null;
  
  constructor(config?: { maxEntries?: number, enabled?: boolean }) {
    if (config?.maxEntries) {
      this.maxEntries = config.maxEntries;
    }
    if (config?.enabled !== undefined) {
      this.enabled = config.enabled;
    }
  }
  
  log(entry: LogEntry): void {
    if (!this.enabled) return;
    
    // Apply level filter if set
    if (this.levelFilter !== null && entry.level !== this.levelFilter) {
      return;
    }
    
    // Add new log and trim if exceeding max entries
    this.logs.unshift(entry);
    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(0, this.maxEntries);
    }
    
    // Notify subscribers
    this.logsSubject.next([...this.logs]);
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  setLevelFilter(level: LogLevel | null): void {
    this.levelFilter = level;
  }
  
  clear(): void {
    this.logs = [];
    this.logsSubject.next([]);
  }
  
  subscribe(callback: (logs: LogEntry[]) => void): () => void {
    const subscription = this.logsSubject.subscribe(callback);
    return () => subscription.unsubscribe();
  }
}

// Default instance
export const uiTransport = new UITransport();
export default uiTransport;
