
import { LoggerService, getLogger } from './logger.service';
import { LogLevel } from './constants/log-level';
import { LogCategory, LogEntry, LogTransport, LoggingConfig } from './types';
import { memoryTransport } from './transports/memory.transport';
import { consoleTransport } from './transports/console.transport';
import { defaultLoggingConfig } from './config';

// Initialize the logger when this module is imported
export function initializeLogger(config?: LoggingConfig): LoggerService {
  return LoggerService.getInstance(config);
}

// Export everything needed for logging system
export {
  LoggerService,
  getLogger,
  LogLevel,
  LogCategory,
  memoryTransport,
  consoleTransport,
  defaultLoggingConfig
};

export type { LogEntry, LogTransport, LoggingConfig };
