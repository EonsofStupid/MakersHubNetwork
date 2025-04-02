
import { useLogger as useLoggerTsx } from './useLogger';
import { LogCategory } from '../types';

/**
 * Re-export the main useLogger hook
 * @deprecated Use the useLogger from './useLogger.tsx' directly
 */
export const useLogger = useLoggerTsx;

/**
 * Re-export with a more specific name for clarity
 */
export function useLoggerWithCategory(source: string, category: LogCategory) {
  return useLogger(source, category);
}
