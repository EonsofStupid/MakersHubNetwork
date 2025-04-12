
import { useRef } from 'react';
import { Logger, createLogger } from '../logger.service';
import { LogCategory } from '../types';

/**
 * React hook for accessing logger functionality
 * 
 * @param source The source/component name
 * @param category The log category
 * @returns Logger instance
 */
export function useLogger(source: string, category: LogCategory = LogCategory.APP): Logger {
  // Use ref to ensure the same logger instance is used across renders
  const loggerRef = useRef<Logger | null>(null);
  
  if (loggerRef.current === null) {
    loggerRef.current = createLogger(source, category);
  }
  
  return loggerRef.current;
}
