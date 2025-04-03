
import { LogEntry } from './types';

type LogCallback = (entry: LogEntry) => void;

/**
 * Event emitter for log events
 */
class LogEventEmitter {
  private logListeners: LogCallback[] = [];

  /**
   * Register a callback for log events
   */
  public onLog(callback: LogCallback): () => void {
    this.logListeners.push(callback);
    
    // Return function to unsubscribe
    return () => {
      this.logListeners = this.logListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Emit a log event to all listeners
   */
  public emitLogEvent(entry: LogEntry): void {
    for (const listener of this.logListeners) {
      try {
        listener(entry);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    }
  }
  
  /**
   * Remove all listeners
   */
  public clearListeners(): void {
    this.logListeners = [];
  }
}

// Export singleton instance
export const logEventEmitter = new LogEventEmitter();
