
import { LogEntry } from './types';

type LogCallback = (entry: LogEntry) => void;

/**
 * Simple event emitter for log events
 */
class LogEventEmitter {
  private subscribers: LogCallback[] = [];
  
  /**
   * Register a callback for log events
   */
  onLog(callback: LogCallback): () => void {
    this.subscribers.push(callback);
    
    // Return an unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Emit a log event to all subscribers
   */
  emit(entry: LogEntry): void {
    this.subscribers.forEach(callback => {
      try {
        callback(entry);
      } catch (error) {
        console.error('Error in log subscriber callback:', error);
      }
    });
  }
  
  /**
   * Get the number of active subscribers
   */
  subscriberCount(): number {
    return this.subscribers.length;
  }
}

// Export a singleton instance
export const logEventEmitter = new LogEventEmitter();
