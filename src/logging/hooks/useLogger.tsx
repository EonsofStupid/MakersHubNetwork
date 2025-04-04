
import { useCallback, useMemo } from 'react';
import { getLogger } from '@/logging';
import { LogCategory, LogLevel, LoggerOptions } from '@/logging/types';

/**
 * Hook for accessing logger functionality within React components
 * 
 * @param source The name of the component or source
 * @param options Additional options for the logger
 */
export function useLogger(source?: string, options?: Partial<LoggerOptions>) {
  const category = options?.category as LogCategory | undefined;
  
  const logger = useMemo(() => {
    return getLogger(source, { category, ...options });
  }, [source, category, options]);
  
  const trace = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.trace(message, additionalOptions);
  }, [logger]);
  
  const debug = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.debug(message, additionalOptions);
  }, [logger]);
  
  const info = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.info(message, additionalOptions);
  }, [logger]);
  
  const warn = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.warn(message, additionalOptions);
  }, [logger]);
  
  const error = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.error(message, additionalOptions);
  }, [logger]);
  
  const fatal = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.fatal(message, additionalOptions);
  }, [logger]);
  
  const success = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.success(message, additionalOptions);
  }, [logger]);
  
  const critical = useCallback((message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.critical(message, additionalOptions);
  }, [logger]);
  
  const log = useCallback((level: LogLevel, message: string, additionalOptions?: Partial<LoggerOptions>) => {
    logger.log(level, message, additionalOptions);
  }, [logger]);
  
  const performance = useCallback((name: string, durationMs: number, success: boolean, additionalOptions?: Partial<LoggerOptions>) => {
    logger.performance(name, durationMs, success, additionalOptions);
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
    log,
    performance
  };
}
