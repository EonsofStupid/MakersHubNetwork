
import { LogEntry, LogLevel, LogTransport } from '../types';
import { BehaviorSubject } from 'rxjs';

/**
 * UI transport configuration
 */
export interface UITransportConfig {
  maxEntries?: number;
  enabled?: boolean;
  minLevel?: LogLevel;
  includeDebug?: boolean;
}

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
  private config: UITransportConfig;
  
  constructor(config?: UITransportConfig) {
    this.config = config || {};
    
    if (config?.maxEntries) {
      this.maxEntries = config.maxEntries;
    }
    if (config?.enabled !== undefined) {
      this.enabled = config.enabled;
    }
  }
  
  log(entry: LogEntry): void {
    if (!this.enabled) return;
    
    // Apply configuration filters
    if (this.config.minLevel !== undefined) {
      const entryLevelValue = Object.values(LogLevel).indexOf(entry.level);
      const minLevelValue = Object.values(LogLevel).indexOf(this.config.minLevel);
      if (entryLevelValue < minLevelValue) return;
    }
    
    if (this.config.includeDebug === false && entry.level === LogLevel.DEBUG) {
      return;
    }
    
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
  
  subscribe(callback: (entries: LogEntry[]) => void): () => void {
    const subscription = this.logsSubject.subscribe(callback);
    return () => subscription.unsubscribe();
  }
}

// Default instance
export const uiTransport = new UITransport();
export default uiTransport;
