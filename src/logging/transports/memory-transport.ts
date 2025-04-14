
import { LogEntry, LogLevel, LOG_LEVEL_VALUES } from '@/shared/types';
import { type LogTransport } from '../types';

interface LogLevelConfig {
  maxEntries: number;
}

const DEFAULT_CONFIG: LogLevelConfig = {
  maxEntries: 1000,
};

export class MemoryTransport implements LogTransport {
  private entries: LogEntry[] = [];
  private maxEntries: number;
  private listeners: Array<(entry: LogEntry) => void> = [];
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(config: LogLevelConfig = DEFAULT_CONFIG) {
    this.maxEntries = config.maxEntries;
  }

  public log(entry: LogEntry): void {
    // Only log if the entry level is >= min level
    if (this.shouldLog(entry.level)) {
      this.entries.push(entry);
      
      // Trim old entries if we exceed max
      if (this.entries.length > this.maxEntries) {
        this.entries = this.entries.slice(this.entries.length - this.maxEntries);
      }
      
      // Notify listeners
      this.notifyListeners(entry);
    }
  }
  
  public getEntries(): LogEntry[] {
    return [...this.entries];
  }
  
  public clearEntries(): void {
    this.entries = [];
  }
  
  public getFilteredEntries(filter: {
    level?: LogLevel;
    search?: string;
    category?: string;
    limit?: number;
  } = {}): LogEntry[] {
    let filtered = [...this.entries];
    
    if (filter.level) {
      filtered = filtered.filter(entry => 
        LOG_LEVEL_VALUES[entry.level] >= LOG_LEVEL_VALUES[filter.level!]);
    }
    
    if (filter.category) {
      filtered = filtered.filter(entry => 
        entry.category === filter.category);
    }
    
    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.message.toLowerCase().includes(search) ||
        (entry.details && JSON.stringify(entry.details).toLowerCase().includes(search)));
    }
    
    if (filter.limit && filtered.length > filter.limit) {
      filtered = filtered.slice(filtered.length - filter.limit);
    }
    
    return filtered;
  }
  
  public subscribe(callback: (entry: LogEntry) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levelValues: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      success: 2,
      warn: 3,
      error: 4,
      critical: 5,
      fatal: 6,
      trace: -1,
      silent: 100 // Adding silent level
    };
    
    return levelValues[level] >= levelValues[this.minLevel];
  }
  
  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }
  
  // Expose name property for identification
  public get name(): string {
    return 'memory';
  }
}
