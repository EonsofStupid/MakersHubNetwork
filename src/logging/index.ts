
// Core functionality
import { loggerService, getLogger } from './service/logger.service';
import { LogCategory, LogLevel } from './types';
import { memoryTransport } from './transports/memory.transport';
import { logEventEmitter } from './events';

// Re-export types and constants
export { LogCategory, LogLevel } from './types';
export { LOG_LEVEL_NAMES, isLogLevelAtLeast } from './constants/log-level';

// Re-export hooks for React components
export { useLogger } from './hooks/useLogger';
export { usePerformanceLogger, useComponentPerformance } from './hooks/usePerformance';
export { useErrorLogger } from './hooks/useErrorLogger';
export { useNetworkLogger } from './hooks/useNetworkLogger';

// Re-export utility functions
export { safelyRenderNode, nodeToSearchableString } from './utils/react';
export { 
  createMeasurement, 
  measureExecution, 
  createSimpleMeasurement, 
  measurePerformance 
} from './utils/performance';

// Export memory transport for direct access
export { memoryTransport } from './transports/memory.transport';

// Initialize the logging system
export function initializeLogger(): void {
  try {
    loggerService.info('Logging system initialized successfully', {
      source: 'LoggingSystem',
      category: LogCategory.SYSTEM
    });
  } catch (error) {
    console.error('Failed to initialize logging system:', error);
  }
}

// Get all logs
export function getLogs() {
  return loggerService.getLogs();
}

// Clear logs
export function clearLogs() {
  loggerService.clearLogs();
}

// Register callback for log events
export function onLog(callback: (entry: any) => void) {
  return logEventEmitter.onLog(callback);
}

// Export getLogger for creating scoped loggers
export { getLogger };
