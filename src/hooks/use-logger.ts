
import { useCallback } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

/**
 * Hook for accessing the logger within React components
 * Returns a logger instance tied to the component name
 * 
 * @param source The source/component name for the logs
 * @param defaultCategory Default category for all logs from this component
 * @returns Logger instance
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logger = getLogger(source);
  
  // Wrap logger methods to include the default category
  const trace = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.trace(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const debug = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.debug(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const info = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.info(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const warn = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.warn(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const error = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.error(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const critical = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.critical(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const success = useCallback((message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.success(message, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
  const performance = useCallback((message: string, duration: number, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
    logger.performance(message, duration, { category: options?.category || defaultCategory, ...options });
  }, [logger, defaultCategory]);
  
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
