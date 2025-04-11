
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Define log event types
export type LogEventType = 
  | 'LOG_INFO'
  | 'LOG_DEBUG'
  | 'LOG_WARNING'
  | 'LOG_ERROR'
  | 'LOG_CRITICAL'
  | 'LOG_CONFIG_CHANGED'
  | 'LOG_VIEWER_OPENED'
  | 'LOG_VIEWER_CLOSED';

export interface LogEvent {
  type: LogEventType;
  source: string;
  category: LogCategory;
  message: string;
  details?: any;
  timestamp: number;
}

type LogEventHandler = (event: LogEvent) => void;

// Create event system
const eventHandlers: LogEventHandler[] = [];

/**
 * Subscribe to log events
 * @param handler The handler function to call when a log event occurs
 * @returns Unsubscribe function
 */
export function subscribeToLogEvents(handler: LogEventHandler): () => void {
  eventHandlers.push(handler);
  
  return () => {
    const index = eventHandlers.indexOf(handler);
    if (index !== -1) {
      eventHandlers.splice(index, 1);
    }
  };
}

/**
 * Publish a log event
 * @param event The log event to publish
 */
export function publishLogEvent(event: LogEvent): void {
  // Don't log the log event publishing to avoid infinite loops
  eventHandlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      console.error('Error in log event handler', error);
    }
  });
}

/**
 * Initialize logging bridge
 */
export function initializeLoggingBridge(): void {
  const logger = getLogger();
  
  logger.info('Initializing logging bridge', {
    category: LogCategory.SYSTEM,
    source: 'logging/bridge'
  });
  
  // Intercept console methods
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  };
  
  // Override console methods to publish events
  console.log = (...args: any[]) => {
    publishLogEvent({
      type: 'LOG_INFO',
      source: 'console',
      category: LogCategory.DEFAULT,
      message: args.map(arg => String(arg)).join(' '),
      details: args,
      timestamp: Date.now()
    });
    originalConsole.log(...args);
  };
  
  console.info = (...args: any[]) => {
    publishLogEvent({
      type: 'LOG_INFO',
      source: 'console',
      category: LogCategory.DEFAULT,
      message: args.map(arg => String(arg)).join(' '),
      details: args,
      timestamp: Date.now()
    });
    originalConsole.info(...args);
  };
  
  console.warn = (...args: any[]) => {
    publishLogEvent({
      type: 'LOG_WARNING',
      source: 'console',
      category: LogCategory.DEFAULT,
      message: args.map(arg => String(arg)).join(' '),
      details: args,
      timestamp: Date.now()
    });
    originalConsole.warn(...args);
  };
  
  console.error = (...args: any[]) => {
    publishLogEvent({
      type: 'LOG_ERROR',
      source: 'console',
      category: LogCategory.DEFAULT,
      message: args.map(arg => String(arg)).join(' '),
      details: args,
      timestamp: Date.now()
    });
    originalConsole.error(...args);
  };
  
  console.debug = (...args: any[]) => {
    publishLogEvent({
      type: 'LOG_DEBUG',
      source: 'console',
      category: LogCategory.DEFAULT,
      message: args.map(arg => String(arg)).join(' '),
      details: args,
      timestamp: Date.now()
    });
    originalConsole.debug(...args);
  };
}
