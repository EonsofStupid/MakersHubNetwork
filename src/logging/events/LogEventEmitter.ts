
import { EventEmitter } from 'events';
import { LogEntry } from '../types';

// Create a singleton event emitter for log events
class LogEventSystem extends EventEmitter {
  private static instance: LogEventSystem;

  private constructor() {
    super();
    // Set higher limit for log event listeners
    this.setMaxListeners(20);
  }

  public static getInstance(): LogEventSystem {
    if (!LogEventSystem.instance) {
      LogEventSystem.instance = new LogEventSystem();
    }
    return LogEventSystem.instance;
  }

  public emitLogEvent(entry: LogEntry): void {
    this.emit('log', entry);
  }

  public onLog(callback: (entry: LogEntry) => void): () => void {
    this.on('log', callback);
    
    // Return an unsubscribe function
    return () => {
      this.off('log', callback);
    };
  }
}

// Export a singleton instance
export const logEventEmitter = LogEventSystem.getInstance();
