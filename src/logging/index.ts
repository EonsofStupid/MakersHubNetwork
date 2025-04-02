
// Core logging functionality
import { loggerService, getLogger } from './service/logger.service';
import { LogCategory, LogLevel } from './types';
import { LoggingProvider, useLoggingContext } from './context/LoggingContext';
import { memoryTransport } from './transports/memory.transport';
import { consoleTransport } from './transports/console.transport';
import { logEventEmitter } from './events';

// React hooks for logging
import { useLogger } from './hooks/useLogger';
import { usePerformanceLogger, useComponentPerformance } from './hooks/usePerformanceLogger';
import { useErrorLogger } from './hooks/useErrorLogger';
import { useNetworkLogger } from './hooks/useNetworkLogger';

// UI components
import { LogConsole } from './components/LogConsole';
import { LogToggleButton } from './components/LogToggleButton';
import { LogActivityStream } from './components/LogActivityStream';

// Utility functions
import { safelyRenderNode, nodeToSearchableString } from './utils/react';
import { 
  createMeasurement, 
  measureExecution, 
  createSimpleMeasurement, 
  measurePerformance 
} from './utils/performance';

// Constants
import { LOG_LEVEL_NAMES, isLogLevelAtLeast } from './constants/log-level';

// Export types
export { LogCategory, LogLevel } from './types';
export type { 
  LogEntry, 
  Logger, 
  LogTransport, 
  LoggingConfig, 
  LoggerOptions, 
  MeasurementResult,
  PerformanceMeasurementOptions
} from './types';

// Export hooks
export { 
  useLogger, 
  usePerformanceLogger, 
  useComponentPerformance,
  useErrorLogger,
  useNetworkLogger
};

// Export components
export { 
  LoggingProvider,
  useLoggingContext,
  LogConsole,
  LogToggleButton,
  LogActivityStream
};

// Export utility functions
export {
  safelyRenderNode,
  nodeToSearchableString,
  createMeasurement,
  measureExecution,
  createSimpleMeasurement,
  measurePerformance,
  LOG_LEVEL_NAMES,
  isLogLevelAtLeast
};

// Export transports
export { 
  memoryTransport, 
  consoleTransport 
};

// Export logger service and helpers
export { 
  loggerService, 
  getLogger, 
  logEventEmitter 
};

// Initialize logging system
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

// Convenience functions for working with logs
export function getLogs() {
  return loggerService.getLogs();
}

export function clearLogs() {
  loggerService.clearLogs();
}

export function onLog(callback: (entry: any) => void) {
  return logEventEmitter.onLog(callback);
}
