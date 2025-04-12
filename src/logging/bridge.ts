
import { EventEmitter } from 'events';
import { LogEntry, LogEvent } from './types';

class LoggingBridgeImpl {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(20); // Increase max listeners to avoid warnings
  }

  public log(entry: LogEntry): void {
    const event: LogEvent = { entry };
    this.emitter.emit('log', event);
    this.emitter.emit(`log:${entry.level}`, event);
    this.emitter.emit(`log:${entry.category}`, event);
  }

  public subscribe(handler: (event: LogEvent) => void): () => void {
    this.emitter.on('log', handler);
    return () => this.emitter.off('log', handler);
  }

  public subscribeToLevel(level: string, handler: (event: LogEvent) => void): () => void {
    const eventName = `log:${level}`;
    this.emitter.on(eventName, handler);
    return () => this.emitter.off(eventName, handler);
  }

  public subscribeToCategory(category: string, handler: (event: LogEvent) => void): () => void {
    const eventName = `log:${category}`;
    this.emitter.on(eventName, handler);
    return () => this.emitter.off(eventName, handler);
  }
}

// Create a singleton instance
export const loggingBridge = new LoggingBridgeImpl();

// Helper function to initialize logging bridge
export function initializeLoggingBridge(): void {
  console.log('Logging bridge initialized');
  // Additional initialization logic can be added here
}
