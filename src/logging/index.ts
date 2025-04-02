
import { loggingSystem } from './LoggingSystem';
import { LogCategory, LogLevel } from './types';

export { LogCategory, LogLevel } from './types';
export { LoggingProvider, useLoggingContext } from './context/LoggingContext';
export { LogConsole } from './components/LogConsole';
export { LogToggleButton } from './components/LogToggleButton';

// Initialize the logging system
export function initializeLogger(): void {
  try {
    loggingSystem.initialize();
    loggingSystem.info('Logging system initialized successfully', {
      category: LogCategory.SYSTEM,
      source: 'LoggingSystem'
    });
  } catch (error) {
    console.error('Failed to initialize logging system:', error);
  }
}

// Get the logger
export function getLogger(source: string = 'App'): {
  info: (message: string, options?: { category?: LogCategory; details?: any }) => void;
  warn: (message: string, options?: { category?: LogCategory; details?: any }) => void;
  error: (message: string, options?: { category?: LogCategory; details?: any }) => void;
  debug: (message: string, options?: { category?: LogCategory; details?: any }) => void;
} {
  return {
    info: (message: string, options?: { category?: LogCategory; details?: any }) => {
      loggingSystem.info(message, { 
        ...options, 
        source 
      });
    },
    warn: (message: string, options?: { category?: LogCategory; details?: any }) => {
      loggingSystem.warn(message, { 
        ...options, 
        source 
      });
    },
    error: (message: string, options?: { category?: LogCategory; details?: any }) => {
      loggingSystem.error(message, { 
        ...options, 
        source 
      });
    },
    debug: (message: string, options?: { category?: LogCategory; details?: any }) => {
      loggingSystem.debug(message, { 
        ...options, 
        source
      });
    }
  };
}

// Get all logs
export function getLogs() {
  return loggingSystem.getLogs();
}

// Clear logs
export function clearLogs() {
  loggingSystem.clearLogs();
}

// Register callback for log events
export function onLog(callback: (entry: any) => void) {
  return loggingSystem.registerLogEventCallback(callback);
}
