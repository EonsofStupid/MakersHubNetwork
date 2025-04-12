
import { useCallback } from 'react';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { LogDetails } from '@/shared/types/logging.types';

// Logger instance type
interface Logger {
  trace: (message: string, options?: { details?: LogDetails }) => void;
  debug: (message: string, options?: { details?: LogDetails }) => void;
  info: (message: string, options?: { details?: LogDetails }) => void;
  success: (message: string, options?: { details?: LogDetails }) => void;
  warn: (message: string, options?: { details?: LogDetails }) => void;
  error: (message: string, options?: { details?: LogDetails }) => void;
  fatal: (message: string, options?: { details?: LogDetails }) => void;
  critical: (message: string, options?: { details?: LogDetails }) => void;
}

/**
 * Custom hook for logging that provides a consistent interface
 * across the application and enforces proper typing
 */
export function useLogger(source: string, category: LogCategory): Logger {
  // Create a logger instance with a specific source and category
  const createLogMethod = useCallback(
    (level: LogLevel) => {
      return (message: string, options?: { details?: LogDetails }): void => {
        // In a real implementation, this would call a global logging service
        console.log(`[${level}][${category}][${source}] ${message}`, options?.details || {});
      };
    },
    [source, category]
  );

  // Return an object with methods for each log level
  return {
    trace: createLogMethod(LogLevel.TRACE),
    debug: createLogMethod(LogLevel.DEBUG),
    info: createLogMethod(LogLevel.INFO),
    success: createLogMethod(LogLevel.SUCCESS),
    warn: createLogMethod(LogLevel.WARN),
    error: createLogMethod(LogLevel.ERROR),
    fatal: createLogMethod(LogLevel.FATAL),
    critical: createLogMethod(LogLevel.CRITICAL),
  };
}
