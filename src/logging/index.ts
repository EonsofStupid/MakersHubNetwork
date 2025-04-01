
import { LoggerService, getLogger } from './logger.service';
import { LogCategory, LogEntry, LogTransport } from './types';
import { LOG_LEVELS, LogLevel } from './constants/log-level';
import { getLoggingConfig, memoryTransport } from './config';

// Initialize the logger with appropriate config
export function initializeLogger(): void {
  const config = getLoggingConfig();
  LoggerService.getInstance(config);
  
  // Log initialization
  const logger = getLogger();
  logger.info('Logging system initialized', {
    category: LogCategory.SYSTEM,
    details: { config },
    source: 'logging/index.ts'
  });
}

// Export everything needed for the logging system
export {
  LoggerService,
  getLogger,
  LOG_LEVELS,
  LogLevel,
  LogCategory,
  memoryTransport
};

export type {
  LogEntry,
  LogTransport
};
