
import { useCallback, useMemo } from 'react';
import { getLogger } from '../service/logger.service';
import { Logger, LogCategory, LoggerOptions } from '../types';

/**
 * Hook for accessing the logger within React components
 */
export function useLogger(source: string = 'component', defaultCategory: LogCategory = LogCategory.UI): Logger {
  // Create a memoized logger instance
  const logger = useMemo(() => {
    return getLogger(source, { category: defaultCategory });
  }, [source, defaultCategory]);
  
  return logger;
}
