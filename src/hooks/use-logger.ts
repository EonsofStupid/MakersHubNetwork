
import { useMemo } from 'react';
import { LogCategory, getLogger } from '@/logging';

export function useLogger(source: string, category: LogCategory) {
  const logger = useMemo(() => {
    const baseLogger = getLogger();
    
    return {
      info: (message: string, details?: any) => 
        baseLogger.info(message, { ...details, source, category }),
      
      warn: (message: string, details?: any) => 
        baseLogger.warn(message, { ...details, source, category }),
      
      error: (message: string, details?: any) => 
        baseLogger.error(message, { ...details, source, category }),
      
      debug: (message: string, details?: any) => 
        baseLogger.debug(message, { ...details, source, category })
    };
  }, [source, category]);
  
  return logger;
}
