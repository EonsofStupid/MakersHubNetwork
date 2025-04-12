
import { LogEntry, LogLevel, Transport } from '../types';
import { LOG_LEVEL_VALUES } from '@/shared/types/shared.types';

type LogCallback = (entry: LogEntry) => void;

export class UiTransport implements Transport {
  private listeners: LogCallback[] = [];
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(options?: { minLevel?: LogLevel }) {
    if (options?.minLevel) {
      this.minLevel = options.minLevel;
    }
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  log(entry: LogEntry): void {
    // Skip if below minimum level
    if (LOG_LEVEL_VALUES[entry.level] < LOG_LEVEL_VALUES[this.minLevel]) {
      return;
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Error in UI log listener:', error);
      }
    });
  }

  // Add a listener for log entries
  subscribe(callback: LogCallback): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
}
