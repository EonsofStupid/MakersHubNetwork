
/**
 * Re-export the useLogger hook from the main implementation 
 * to maintain backward compatibility
 */
import { useLogger as useLoggerImpl } from './useLogger';
import { LogCategory } from '../types';

/**
 * Re-export the main useLogger hook
 */
export const useLogger = useLoggerImpl;

/**
 * Re-export with a more specific name for clarity
 */
export function useLoggerWithCategory(source: string, category: LogCategory) {
  return useLogger(source, category);
}
