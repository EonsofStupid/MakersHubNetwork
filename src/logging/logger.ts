
import { v4 as uuidv4 } from 'uuid';
import { 
  Logger, 
  LoggerOptions, 
  LogLevel, 
  LogOptions, 
  LogEntry,
  LogCategory
} from './types';
import { memoryTransport } from './transports/memory.transport';
import { consoleTransport } from './transports/console.transport';

// Default transports
const defaultTransports = [memoryTransport, consoleTransport];

// Global config
const config = {
  minLevel: LogLevel.INFO,
  transports: [...defaultTransports],
  categoryLevels: {} as Record<string, LogLevel>,
  bufferSize: 1000
};

/**
 * Set minimum log level globally
 */
export function setMinLogLevel(level: LogLevel): void {
  config.minLevel = level;
}

/**
 * Set category-specific log level
 */
export function setCategoryLogLevel(category: LogCategory, level: LogLevel): void {
  config.categoryLevels[category] = level;
}

/**
 * Add a transport
 */
export function addTransport(transport: any): void {
  if (transport && typeof transport.log === 'function') {
    config.transports.push(transport);
  }
}

/**
 * Create a logger
 */
export function getLogger(source: string, options: LoggerOptions = {}): Logger {
  const loggerOptions: LoggerOptions = {
    minLevel: LogLevel.INFO,
    category: LogCategory.GENERAL,
    tags: [],
    reportErrors: true,
    includeTraces: false,
    ...options,
    source
  };

  /**
   * Create a log entry
   */
  const createLogEntry = (
    level: LogLevel,
    message: string,
    options: LogOptions = {}
  ): LogEntry => {
    const timestamp = options.timestamp || new Date();
    
    return {
      id: uuidv4(),
      timestamp: timestamp.toISOString(),
      level,
      message,
      category: options.category || loggerOptions.category || LogCategory.GENERAL,
      source: options.source || loggerOptions.source || source,
      tags: [...(loggerOptions.tags || []), ...(options.tags || [])],
      details: options.details || loggerOptions.details,
      trace: options.includeTrace ? new Error().stack : undefined,
      user_id: undefined,
      session_id: undefined,
      app_version: undefined
    };
  };

  /**
   * Logs a message at the specified level
   */
  const log = (level: LogLevel, message: string, options: LogOptions = {}) => {
    // Skip if below minimum level
    const minLevel = options.level ?? loggerOptions.minLevel ?? config.minLevel;
    
    // Check if category has specific level requirement
    const categoryLevel = config.categoryLevels[options.category || (loggerOptions.category as string) || ''];
    const effectiveMinLevel = categoryLevel !== undefined ? categoryLevel : minLevel;
    
    if (level < effectiveMinLevel) {
      return;
    }
    
    const entry = createLogEntry(level, message, options);
    
    // Send to all transports
    for (const transport of config.transports) {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    }
    
    return entry;
  };

  return {
    trace: (message, options) => log(LogLevel.TRACE, message, options),
    debug: (message, options) => log(LogLevel.DEBUG, message, options),
    info: (message, options) => log(LogLevel.INFO, message, options),
    warn: (message, options) => log(LogLevel.WARN, message, options),
    error: (message, options) => log(LogLevel.ERROR, message, options),
    fatal: (message, options) => log(LogLevel.FATAL, message, options),
    success: (message, options) => log(LogLevel.SUCCESS, message, options),
    critical: (message, options) => log(LogLevel.CRITICAL, message, options),
    log: (level, message, options) => log(level, message, options),
    performance: (name, durationMs, success, options = {}) => {
      const level = success ? LogLevel.DEBUG : LogLevel.WARN;
      const message = `${name} completed in ${durationMs.toFixed(2)}ms`;
      return log(level, message, {
        ...options,
        details: { 
          ...(options.details || {}), 
          name, 
          duration: durationMs, 
          success 
        }
      });
    }
  };
}

// Create default logger
export const logger = getLogger('app');
