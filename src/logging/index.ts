
import { LoggerService, getLogger } from './core/logger.service';
import { LogCategory, LogLevel } from './types';
import { getLoggingConfig } from './config';
import { memoryTransport } from './transports/memory.transport';
import { logEventEmitter } from './events/log-event-emitter';

// Re-export types and constants
export { LogCategory, LogLevel } from './types';
export { LOG_LEVEL_NAMES } from './constants/log-level';
export { LoggingProvider, useLoggingContext } from './context/LoggingContext';
export { LogConsole } from './components/LogConsole';
export { LogToggleButton } from './components/LogToggleButton';

// Re-export memory transport for direct access
export { memoryTransport } from './transports/memory.transport';

// Re-export hooks
export { useLogger } from './hooks/use-logger';
export { usePerformanceLogger, useComponentPerformance } from './hooks/use-performance';

// Re-export utils
export * from './utils/react-utils';
export * from './utils/performance';

// Initialize the logging system
export function initializeLogger(): void {
  try {
    const config = getLoggingConfig();
    const logger = LoggerService.getInstance(config);
    logger.info('Logging system initialized successfully', {
      category: LogCategory.SYSTEM,
      source: 'LoggingSystem'
    });
  } catch (error) {
    console.error('Failed to initialize logging system:', error);
  }
}

// Export getLogger for convenience
export { getLogger };

// Get all logs
export function getLogs() {
  return LoggerService.getInstance().getLogs();
}

// Clear logs
export function clearLogs() {
  LoggerService.getInstance().clearLogs();
}

// Register callback for log events
export function onLog(callback: (entry: any) => void) {
  return logEventEmitter.onLog(callback);
}
