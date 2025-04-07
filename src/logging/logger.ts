
import { LogLevel } from './constants/log-level';
import { LogCategory, LogEntry, Transport, LogOptions } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ReactNode } from 'react';
import { memoryTransport } from './transports/memory-transport';

// Default config
const defaultConfig = {
  minLevel: LogLevel.INFO,
  transports: [memoryTransport],
  includeSource: true,
  includeUser: false,
  includeSession: false,
};

let config = { ...defaultConfig };

// Logger functions
export function initializeLogger(customConfig = {}) {
  config = { ...defaultConfig, ...customConfig };
  return config;
}

export function getLogger(source?: string) {
  // Create log method function generator
  const createLogMethod = (level: LogLevel) => {
    return (message: string | ReactNode, options: LogOptions = {}) => {
      // Skip if level is below minimum
      if (getLevelValue(level) < getLevelValue(config.minLevel)) return;
      
      // Create log entry
      const entry: LogEntry = {
        id: uuidv4(),
        timestamp: new Date(),
        level,
        category: options.category || LogCategory.SYSTEM,
        message,
        details: options.details,
        source: config.includeSource ? (options.source || source) : undefined,
        userId: config.includeUser ? options.userId : undefined,
        sessionId: config.includeSession ? options.sessionId : undefined,
        duration: options.duration,
        tags: options.tags,
        error: options.error,
        success: options.success
      };
      
      // Send to all transports
      config.transports.forEach(transport => transport.log(entry));
      
      return entry;
    };
  };
  
  return {
    trace: createLogMethod(LogLevel.TRACE),
    debug: createLogMethod(LogLevel.DEBUG),
    info: createLogMethod(LogLevel.INFO),
    warn: createLogMethod(LogLevel.WARN),
    error: createLogMethod(LogLevel.ERROR),
    critical: createLogMethod(LogLevel.CRITICAL),
    getTransports: () => config.transports, // Add getTransports method
  };
}

// Helper function to get numerical value for log levels
function getLevelValue(level: LogLevel): number {
  const levels: Record<LogLevel, number> = {
    [LogLevel.TRACE]: 0,
    [LogLevel.DEBUG]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.SUCCESS]: 2,
    [LogLevel.WARN]: 3,
    [LogLevel.ERROR]: 4,
    [LogLevel.CRITICAL]: 5,
  };
  
  return levels[level] || 0;
}
