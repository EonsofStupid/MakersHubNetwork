
import { useCallback } from 'react';
import { Logger, LoggerOptions, LogOptions } from '../types';
import { getLogger } from '../service/logger.service';

/**
 * React hook for accessing the logger
 * @param source The source name (typically component name)
 * @param options Additional logger options
 */
export function useLogger(source?: string, options: LoggerOptions = {}): Logger {
  const componentName = source || 'Component';
  
  const logger = getLogger(componentName, options);
  
  // Memoize the logger to prevent recreation on each render
  // However, each log method is still memoized separately to avoid closure issues
  
  const trace = useCallback(function trace(message: string, msgOptions?: LogOptions) {
    logger.trace(message, msgOptions);
  }, [logger]);
  
  const debug = useCallback(function debug(message: string, msgOptions?: LogOptions) {
    logger.debug(message, msgOptions);
  }, [logger]);
  
  const info = useCallback(function info(message: string, msgOptions?: LogOptions) {
    logger.info(message, msgOptions);
  }, [logger]);
  
  const warn = useCallback(function warn(message: string, msgOptions?: LogOptions) {
    logger.warn(message, msgOptions);
  }, [logger]);
  
  const error = useCallback(function error(message: string, msgOptions?: LogOptions) {
    logger.error(message, msgOptions);
  }, [logger]);
  
  const fatal = useCallback(function fatal(message: string, msgOptions?: LogOptions) {
    logger.fatal(message, msgOptions);
  }, [logger]);
  
  const success = useCallback(function success(message: string, msgOptions?: LogOptions) {
    if (logger.success) {
      logger.success(message, msgOptions);
    } else {
      logger.info(`SUCCESS: ${message}`, msgOptions);
    }
  }, [logger]);
  
  const critical = useCallback(function critical(message: string, msgOptions?: LogOptions) {
    if (logger.critical) {
      logger.critical(message, msgOptions);
    } else {
      logger.error(`CRITICAL: ${message}`, msgOptions);
    }
  }, [logger]);
  
  const performance = useCallback(function performance(message: string, duration: number, msgOptions?: LogOptions) {
    if (logger.performance) {
      logger.performance(message, duration, msgOptions);
    } else {
      logger.info(`PERFORMANCE: ${message} (${duration}ms)`, msgOptions);
    }
  }, [logger]);
  
  return {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
    success,
    critical,
    performance
  };
}
