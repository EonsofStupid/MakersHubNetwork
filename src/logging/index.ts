
import { loggingSystem } from './LoggingSystem';
import { LogCategory, LogLevel } from './types';

// Re-export types and constants
export { LogCategory, LogLevel } from './types';
export { LOG_LEVEL_NAMES } from './constants/log-level';
export { LoggingProvider, useLoggingContext } from './context/LoggingContext';
export { LogConsole } from './components/LogConsole';
export { LogToggleButton } from './components/LogToggleButton';

// Re-export memory transport for direct access
export { memoryTransport } from './transports/memory.transport';

// Re-export utils
export * from './utils/logger-utils';

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
  trace: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  debug: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  info: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  warn: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  error: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  critical: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  success: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  performance: (message: string, duration: number, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
} {
  return {
    trace: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.trace(message, { ...options, source });
    },
    debug: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.debug(message, { ...options, source });
    },
    info: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.info(message, { ...options, source });
    },
    warn: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.warn(message, { ...options, source });
    },
    error: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.error(message, { ...options, source });
    },
    critical: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.critical(message, { ...options, source });
    },
    success: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.success(message, { ...options, source });
    },
    performance: (message: string, duration: number, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      loggingSystem.performance(message, duration, { ...options, source });
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
