
import { LogCategory } from '@/shared/types/shared.types';
import { Logger, createLogger } from '@/logging/logger.service';

/**
 * Hook for accessing the logger in components
 */
export function useLogger(source: string, category: LogCategory): Logger {
  return createLogger(source, category);
}
