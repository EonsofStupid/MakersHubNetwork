
import { getLogger } from './index';
import { LogCategory } from './types';

// Define log event types for typesafety
export type LogEventType = 'log' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
export type LogEventLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LogEventPayload = {
  type: LogEventType;
  message: string;
  level: LogEventLevel;
  category?: LogCategory;
  source?: string;
  details?: Record<string, any>;
  timestamp: number;
};

type LogEventListener = (payload: LogEventPayload) => void;

/**
 * LoggingBridge implementation
 * 
 * This provides a clean interface for other modules to interact with 
 * the Logging module without direct dependencies.
 */
class LoggingBridgeImpl {
  private listeners: Map<string, LogEventListener[]> = new Map();
  private logger = getLogger();
  private initialized: boolean = false;
  
  /**
   * Initialize the Logging bridge
   */
  initialize() {
    if (this.initialized) {
      return;
    }
    
    this.logger.info('Initializing LoggingBridge', {
      category: LogCategory.SYSTEM,
      source: 'LoggingBridge'
    });
    
    this.initialized = true;
    return true;
  }
  
  /**
   * Subscribe to log events
   */
  subscribe(event: LogEventType, listener: LogEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    const eventListeners = this.listeners.get(event)!;
    eventListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Publish a log event
   */
  publish(event: LogEventType, payload: Omit<LogEventPayload, 'type' | 'timestamp'>) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const eventListeners = this.listeners.get(event)!;
    const fullPayload = { 
      type: event, 
      timestamp: Date.now(), 
      ...payload 
    };
    
    // Use setTimeout to avoid blocking
    setTimeout(() => {
      eventListeners.forEach(listener => {
        try {
          listener(fullPayload);
        } catch (error) {
          console.error(`Error in log event listener for ${event}`, error);
        }
      });
    }, 0);
  }
  
  /**
   * Log a message
   */
  log(level: LogEventLevel, message: string, options?: { 
    category?: LogCategory, 
    source?: string, 
    details?: Record<string, any> 
  }) {
    this.publish('log', {
      level,
      message,
      ...options
    });
  }
}

// Export singleton instance
export const LoggingBridge = new LoggingBridgeImpl();

/**
 * Initialize the Logging bridge
 */
export function initializeLoggingBridge() {
  return LoggingBridge.initialize();
}

/**
 * Export LoggingBridge functionality
 */
export function subscribeToLoggingEvents(event: LogEventType, listener: LogEventListener) {
  return LoggingBridge.subscribe(event, listener);
}

export function publishLoggingEvent(event: LogEventType, payload: Omit<LogEventPayload, 'type' | 'timestamp'>) {
  LoggingBridge.publish(event, payload);
}
