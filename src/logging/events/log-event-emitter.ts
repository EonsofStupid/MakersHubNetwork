
import { EventEmitter } from 'events';
import { LogEntry, LogEventCallback } from '../types';

/**
 * Singleton event emitter for log events
 */
class LogEventEmitter extends EventEmitter {
  private static instance: LogEventEmitter;

  private constructor() {
    super();
    // Set higher limit for log event listeners
    this.setMaxListeners(20);
  }

  public static getInstance(): LogEventEmitter {
    if (!LogEventEmitter.instance) {
      LogEventEmitter.instance = new LogEventEmitter();
    }
    return LogEventEmitter.instance;
  }

  /**
   * Emit a log event
   */
  public emitLogEvent(entry: LogEntry): void {
    this.emit('log', entry);
  }

  /**
   * Subscribe to log events
   * @returns Unsubscribe function
   */
  public onLog(callback: LogEventCallback): () => void {
    this.on('log', callback);
    
    // Return unsubscribe function
    return () => {
      this.off('log', callback);
    };
  }
  
  /**
   * Get current listener count
   */
  public getListenerCount(): number {
    return this.listenerCount('log');
  }
}

// Export singleton instance
export const logEventEmitter = LogEventEmitter.getInstance();
