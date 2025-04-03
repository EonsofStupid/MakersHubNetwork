
import { LogEntry, LogEventCallback } from './types';

/**
 * Simple event emitter for log events
 */
class LogEventEmitter {
  private listeners: Set<LogEventCallback> = new Set();
  
  /**
   * Register a callback for log events
   * Returns an unsubscribe function
   */
  onLog(callback: LogEventCallback): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  /**
   * Emit a log event to all registered listeners
   */
  emitLogEvent(entry: LogEntry): void {
    this.listeners.forEach(callback => {
      try {
        callback(entry);
      } catch (error) {
        console.error('Error in log event listener:', error);
      }
    });
  }
  
  /**
   * Get the number of registered listeners
   */
  get listenerCount(): number {
    return this.listeners.size;
  }
}

// Export singleton instance
export const logEventEmitter = new LogEventEmitter();
