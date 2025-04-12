
import { useCallback, useMemo } from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * Hook to create and use a logger with a specific source and category
 * 
 * @param source The source component/module using the logger
 * @param category The log category (defaults to APP)
 * @returns A logger instance
 */
export function useLogger(source: string, category: LogCategory = LogCategory.APP) {
  const logger = useMemo(() => {
    return getLogger(source, category);
  }, [source, category]);

  return logger;
}
