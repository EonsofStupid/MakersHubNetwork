
// Core types
export { LogCategory, LogLevel } from './types';
export type { 
  LogEntry, 
  Logger, 
  LogTransport, 
  LoggingConfig, 
  LoggerOptions, 
  MeasurementResult,
  PerformanceMeasurementOptions,
  MeasurementCompletionData,
  PerformanceMeasurement
} from './types';

// Core logging functionality
export { 
  getLogger, 
  initializeLogger, 
  loggerService
} from './service/logger.service';

// Re-export event emitter
export { logEventEmitter } from './events';

// Context provider and hooks
export { 
  LoggingProvider, 
  useLoggingContext 
} from './context/LoggingContext';

export { 
  useLogger 
} from './hooks/useLogger';

export { 
  usePerformanceLogger, 
  useComponentPerformance 
} from './hooks/usePerformanceLogger';

export { 
  useErrorLogger 
} from './hooks/useErrorLogger';

export { 
  useNetworkLogger 
} from './hooks/useNetworkLogger';

// UI components
export { 
  LogConsole 
} from './components/LogConsole';

export { 
  LogToggleButton 
} from './components/LogToggleButton';

export { 
  LogActivityStream 
} from './components/LogActivityStream';

export { 
  LogNotification 
} from './components/LogNotification';

export { 
  InlineLogIndicator 
} from './components/InlineLogIndicator';

// Utility functions
export { 
  safelyRenderNode, 
  nodeToSearchableString 
} from './utils/react';

export {
  createMeasurement,
  measureExecution,
  createSimpleMeasurement,
  measurePerformance
} from './utils/performance';

// Constants
export { 
  LOG_LEVEL_NAMES, 
  isLogLevelAtLeast,
  getLogLevelName,
  getLogLevelColorClass,
  getLogItemClass,
  getLogLevelFromString
} from './constants/log-level';

// Transports
export { 
  memoryTransport 
} from './transports/memory.transport';

export { 
  consoleTransport 
} from './transports/console.transport';

export {
  uiTransport
} from './transports/ui-transport';

// Export the formatLogDetails utility for use throughout the app
export { formatLogDetails } from './utils/details-formatter';

// Export the safeDetails utility 
export { safeDetails } from './utils/safeDetails';

// Type guards
export {
  isError,
  isRecord,
  isString,
  isNumber,
  isBoolean,
  isValidUUID,
  generateUUID,
  toLogDetails
} from './utils/type-guards';

// Helper functions for working with logs
export function getLogs() {
  return memoryTransport.getLogs();
}

export function clearLogs() {
  return memoryTransport.clear();
}

export function onLog(callback: (entry: LogEntry) => void) {
  return logEventEmitter.onLog(callback);
}
