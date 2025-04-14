
import { useCallback } from 'react';
import { logger } from '../logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

/**
 * Custom hook for logging
 * @param context Logger context name
 * @param category Log category
 * @returns Logger methods
 */
export function useLogger(context: string, category: LogCategory = LogCategory.SYSTEM) {
  const debug = useCallback((message: string, details: Record<string, unknown> = {}) => {
    logger.log(LogLevel.DEBUG, category, `[${context}] ${message}`, details);
  }, [context, category]);
  
  const info = useCallback((message: string, details: Record<string, unknown> = {}) => {
    logger.log(LogLevel.INFO, category, `[${context}] ${message}`, details);
  }, [context, category]);
  
  const warn = useCallback((message: string, details: Record<string, unknown> = {}) => {
    logger.log(LogLevel.WARN, category, `[${context}] ${message}`, details);
  }, [context, category]);
  
  const error = useCallback((message: string, details: Record<string, unknown> = {}) => {
    logger.log(LogLevel.ERROR, category, `[${context}] ${message}`, details);
  }, [context, category]);
  
  return { debug, info, warn, error };
}
