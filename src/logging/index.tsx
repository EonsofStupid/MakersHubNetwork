
import React from 'react';
import {
  Logger,
  LogEntry,
  LoggerOptions,
  LogTransport,
  LoggingConfig,
  LogCategory,
  LogLevel,
  PerformanceMeasurementOptions
} from './types';
import { getLogger, initializeLogger, loggerService, memoryTransport } from './service/logger.service';
import { logEventEmitter } from './events';

// Re-export types
export type { 
  Logger,
  LogEntry,
  LoggerOptions,
  LogTransport,
  LoggingConfig,
  PerformanceMeasurementOptions
};

// Export enums (as values and types)
export { LogLevel, LogCategory };

// Re-export core functions
export { getLogger, initializeLogger };

// Re-export services and transports
export { loggerService, memoryTransport };

// Export event emitter
export { logEventEmitter };

// Export hooks
export { useLogger } from './hooks/useLogger';
export { useErrorLogger } from './hooks/useErrorLogger';
export { useComponentPerformance } from './hooks/useComponentPerformance';
export { usePerformanceLogger } from './hooks/usePerformanceLogger';

// Set default log level based on environment
const defaultLogLevel = process.env.NODE_ENV === 'production'
  ? LogLevel.INFO
  : LogLevel.DEBUG;

// Initialize the logger with console transport by default
initializeLogger({
  minLevel: defaultLogLevel,
  flushInterval: 5000, // 5 seconds
  bufferSize: 20,
  includeSource: true,
  includeSession: true,
  includeUser: true,
  transports: [memoryTransport]
});

/**
 * Get all logs from the memory transport
 */
export function getLogs(): LogEntry[] {
  return memoryTransport.getLogs ? memoryTransport.getLogs() : [];
}

/**
 * Clear logs from the memory transport
 */
export function clearLogs(): void {
  if (memoryTransport.clear) {
    memoryTransport.clear();
  }
}

/**
 * Register a callback for log events
 */
export function onLog(callback: (entry: LogEntry) => void): () => void {
  return logEventEmitter.onLog(callback);
}

/**
 * Create a React component to monitor logs
 */
export function LogMonitor({ onLogEvent }: { onLogEvent?: (entry: LogEntry) => void }) {
  if (typeof onLogEvent === 'function') {
    // Register log event listener on mount
    React.useEffect(() => {
      const unsubscribe = logEventEmitter.onLog(onLogEvent);
      return unsubscribe;
    }, [onLogEvent]);
  }
  
  return null; // This component doesn't render anything visible
}
