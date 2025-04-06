
import { LogEntry, LogTransport } from '../types';

class MemoryTransport implements LogTransport {
  id: string;
  name: string;
  enabled: boolean;
  private logs: LogEntry[];
  private maxEntries: number;
  private subscribers: ((entries: LogEntry[]) => void)[];

  constructor(maxEntries = 1000) {
    this.id = 'memory-transport';
    this.name = 'Memory Transport';
    this.enabled = true;
    this.logs = [];
    this.maxEntries = maxEntries;
    this.subscribers = [];
  }

  log(entry: LogEntry): void {
    if (!this.enabled) return;
    
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

export const memoryTransport = new MemoryTransport();
