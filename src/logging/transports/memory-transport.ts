
import { LogEntry, LogLevel } from '../types';
import { LogTransport } from '../types';
import { isLogLevelAtLeast } from '../utils/map-log-level';
import { nodeToSearchableString } from '@/shared/rendering';

interface MemoryTransportOptions {
  /**
   * Maximum number of log entries to keep in memory
   */
  maxEntries?: number;
  
  /**
   * Minimum log level to store in memory
   */
  minLevel?: LogLevel;
}

interface MemoryTransportState {
  entries: LogEntry[];
  searchableEntries: Record<string, string>;
}

/**
 * A log transport that stores log entries in memory
 * Useful for displaying logs in the UI
 */
export class MemoryTransport implements LogTransport {
  private options: Required<MemoryTransportOptions>;
  private state: MemoryTransportState;
  
  private listeners: ((entries: LogEntry[]) => void)[] = [];
  
  constructor(options: MemoryTransportOptions = {}) {
    this.options = {
      maxEntries: options.maxEntries ?? 1000,
      minLevel: options.minLevel ?? LogLevel.DEBUG,
    };
    
    this.state = {
      entries: [],
      searchableEntries: {},
    };
  }
  
  /**
   * Add a log entry to memory
   */
  log(entry: LogEntry): void {
    // Skip entries below minimum level
    if (!isLogLevelAtLeast(entry.level, this.options.minLevel)) {
      return;
    }
    
    // Add entry to memory
    this.state.entries.unshift(entry);
    
    // Create searchable version of the entry
    this.state.searchableEntries[entry.id] = nodeToSearchableString(entry.message);
    
    // Limit number of entries
    while (this.state.entries.length > this.options.maxEntries) {
      const removed = this.state.entries.pop();
      if (removed) {
        delete this.state.searchableEntries[removed.id];
      }
    }
    
    // Notify listeners
    this.notifyListeners();
  }
  
  /**
   * Get all log entries
   */
  getEntries(): LogEntry[] {
    return [...this.state.entries];
  }
  
  /**
   * Filter log entries by search text
   */
  search(text: string): LogEntry[] {
    if (!text) {
      return this.getEntries();
    }
    
    const searchText = text.toLowerCase();
    
    return this.state.entries.filter((entry) => {
      const searchableText = this.state.searchableEntries[entry.id] || '';
      return searchableText.toLowerCase().includes(searchText);
    });
  }
  
  /**
   * Clear all log entries
   */
  clear(): void {
    this.state.entries = [];
    this.state.searchableEntries = {};
    this.notifyListeners();
  }
  
  /**
   * Subscribe to log entry updates
   */
  subscribe(listener: (entries: LogEntry[]) => void): () => void {
    this.listeners.push(listener);
    
    // Notify immediately with current entries
    listener(this.getEntries());
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  
  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    const entries = this.getEntries();
    this.listeners.forEach((listener) => {
      try {
        listener(entries);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }
}

// Create singleton instance
export const memoryTransport = new MemoryTransport();
