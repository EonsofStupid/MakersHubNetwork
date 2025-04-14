
import { LogLevel, LogCategory, LogEntry, LogDetails } from '@/shared/types/shared.types';
import { ConsoleTransport } from './transports/console-transport';
import { MemoryTransport } from './transports/memory-transport';

export interface LogTransport {
  log(entry: LogEntry): void;
  setMinLevel(level: LogLevel): void;
  getEntries?(): LogEntry[];
  clear?(): void;
}

export class LoggerService {
  private static instance: LoggerService;
  private transports: LogTransport[] = [
    new ConsoleTransport({ minLevel: LogLevel.INFO }),
    new MemoryTransport({ maxEntries: 200 })
  ];
  private minLevel: LogLevel = LogLevel.INFO;

  private constructor() {
    // Singleton instance
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Log a message with a specific level and category
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    // Create log entry
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level,
      category,
      message,
      details,
      source: details?.source as string
    };

    // Send to transports
    this.transports.forEach(transport => {
      transport.log(entry);
    });

    // Emit event
    this.emit('log', { entry });
  }

  /**
   * Set the minimum log level
   */
  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
    
    // Update all transports
    this.transports.forEach(transport => {
      transport.setMinLevel(level);
    });
  }

  /**
   * Add a transport
   */
  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Get all log entries
   */
  public getEntries(): LogEntry[] {
    const memoryTransport = this.transports.find(
      t => t instanceof MemoryTransport
    ) as MemoryTransport;
    
    return memoryTransport ? memoryTransport.getEntries() : [];
  }

  /**
   * Clear all log entries
   */
  public clear(): void {
    const memoryTransport = this.transports.find(
      t => t instanceof MemoryTransport
    ) as MemoryTransport;
    
    if (memoryTransport && memoryTransport.clear) {
      memoryTransport.clear();
    }
  }

  // Helper methods for common log levels
  public debug(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  public info(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }

  public warn(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }

  public error(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }

  public success(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.SUCCESS, category, message, details);
  }

  // Event handling
  private eventListeners: Record<string, Function[]> = {};

  public on(event: string, callback: Function): () => void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    };
  }

  public subscribe(callback: (entry: LogEntry) => void): () => void {
    return this.on('log', (event: { entry: LogEntry }) => callback(event.entry));
  }

  private emit(event: string, data: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  // Generate unique ID for log entries
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // Get statistics
  public getStats(): Record<string, any> {
    const entries = this.getEntries();
    
    // By level
    const byLevel = entries.reduce<Record<LogLevel, number>>((acc, entry) => {
      acc[entry.level] = (acc[entry.level] || 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);
    
    // By category
    const byCategory = entries.reduce<Record<LogCategory, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<LogCategory, number>);
    
    return {
      total: entries.length,
      byLevel,
      byCategory
    };
  }
}

// Export singleton instance
export const logger = LoggerService.getInstance();
