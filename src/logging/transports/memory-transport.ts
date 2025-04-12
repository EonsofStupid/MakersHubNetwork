
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogEntry, LogLevel } from '../types';
import { LogFilter, LogTransport } from '../types';

export class MemoryTransport implements LogTransport {
  private maxEntries: number;
  private entries: LogEntry[] = [];
  private listeners: ((entries: LogEntry[]) => void)[] = [];

  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }

  public log(entry: LogEntry): void {
    // Ensure entry has an ID
    if (!entry.id) {
      entry = {
        ...entry,
        id: uuidv4()
      };
    }
    
    // Add to front if we're using a reversed view
    this.entries.unshift(entry);
    
    // Trim if over the limit
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
    
    // Notify listeners
    this.notifyListeners();
  }

  public clear(): void {
    this.entries = [];
    this.notifyListeners();
  }

  public getEntries(): LogEntry[] {
    return [...this.entries];
  }

  public filter(filter: LogFilter): LogEntry[] {
    return this.entries.filter(entry => {
      // Filter by level
      if (filter.level !== undefined) {
        if (entry.level !== filter.level) return false;
      }
      
      // Filter by category
      if (filter.category !== undefined) {
        if (entry.category !== filter.category) return false;
      }
      
      // Filter by source
      if (filter.source !== undefined) {
        if (entry.source !== filter.source) return false;
      }
      
      // Filter by search text
      if (filter.search !== undefined && filter.search !== '') {
        const searchLower = filter.search.toLowerCase();
        const messageMatches = entry.message.toLowerCase().includes(searchLower);
        const sourceMatches = entry.source.toLowerCase().includes(searchLower);
        const detailsMatch = entry.details ? 
          JSON.stringify(entry.details).toLowerCase().includes(searchLower) : 
          false;
          
        if (!(messageMatches || sourceMatches || detailsMatch)) return false;
      }
      
      // Filter by user ID if applicable
      if (entry.userId && filter.userId) {
        if (entry.userId !== filter.userId) return false;
      }
      
      // Filter by start time
      if (filter.startTime) {
        if (entry.timestamp < filter.startTime.getTime()) return false;
      }
      
      // Filter by end time
      if (filter.endTime) {
        if (entry.timestamp > filter.endTime.getTime()) return false;
      }
      
      return true;
    });
  }

  public addChangeListener(listener: (entries: LogEntry[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.entries]);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const entriesCopy = [...this.entries];
    this.listeners.forEach(listener => listener(entriesCopy));
  }
}

// Create and export a singleton instance
export const memoryTransport = new MemoryTransport();
