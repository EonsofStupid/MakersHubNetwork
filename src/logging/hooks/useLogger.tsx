
import { useCallback } from 'react';
import { Logger, LoggerOptions } from '../types';
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
  
  const trace = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.trace(message, msgOptions);
  }, [logger]);
  
  const debug = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.debug(message, msgOptions);
  }, [logger]);
  
  const info = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.info(message, msgOptions);
  }, [logger]);
  
  const warn = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.warn(message, msgOptions);
  }, [logger]);
  
  const error = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.error(message, msgOptions);
  }, [logger]);
  
  const critical = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.critical(message, msgOptions);
  }, [logger]);
  
  const success = useCallback((message: string, msgOptions?: LoggerOptions) => {
    logger.success(message, msgOptions);
  }, [logger]);
  
  const performance = useCallback((message: string, duration: number, msgOptions?: LoggerOptions) => {
    logger.performance(message, duration, msgOptions);
  }, [logger]);
  
  return {
    trace,
    debug,
    info,
    warn,
    error,
    critical,
    success,
    performance
  };
}
