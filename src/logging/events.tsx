
import { LogEntry, LogEventCallback } from './types';

/**
 * Event emitter for logging events
 */
class LogEventEmitter {
  private subscribers: LogEventCallback[] = [];
  
  /**
   * Subscribe to log events
   */
  public onLog(callback: LogEventCallback): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Emit a log event to all subscribers
   */
  public emitLogEvent(entry: LogEntry): void {
    // Call each subscriber with the log entry
    for (const subscriber of this.subscribers) {
      try {
        subscriber(entry);
      } catch (error) {
        console.error('Error in log subscriber:', error);
      }
    }
  }
}

// Export singleton instance
export const logEventEmitter = new LogEventEmitter();
