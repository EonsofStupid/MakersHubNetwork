
import { useCallback } from 'react';
import { LogCategory, LogLevel } from '../types/logging';

export function useLogger(context: string, category: LogCategory = LogCategory.APP) {
  const log = useCallback((level: LogLevel, message: string, options?: { details?: Record<string, any> }) => {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      category,
      context,
      message,
      ...options
    };

    // Console logging based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}][${level}][${category}][${context}]`, message, options?.details || '');
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}][${level}][${category}][${context}]`, message, options?.details || '');
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}][${level}][${category}][${context}]`, message, options?.details || '');
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}][${level}][${category}][${context}]`, message, options?.details || '');
        break;
      default:
        console.log(`[${timestamp}][${level}][${category}][${context}]`, message, options?.details || '');
    }

    // Here you could also send logs to a central logging service
    // logService.send(logData);

    return logData;
  }, [context, category]);

  return {
    debug: useCallback((message: string, options?: { details?: Record<string, any> }) => 
      log(LogLevel.DEBUG, message, options), [log]),
    
    info: useCallback((message: string, options?: { details?: Record<string, any> }) => 
      log(LogLevel.INFO, message, options), [log]),
    
    warn: useCallback((message: string, options?: { details?: Record<string, any> }) => 
      log(LogLevel.WARN, message, options), [log]),
    
    error: useCallback((message: string, options?: { details?: Record<string, any> }) => 
      log(LogLevel.ERROR, message, options), [log]),
    
    log
  };
}
