
import { useLogger as useLoggerOriginal } from '@/logging/hooks/useLogger';
import { LoggerOptions } from '@/logging/types';
import { LogCategory, LogLevel } from '@/constants/logLevel';

/**
 * Re-export the useLogger hook from the logging module
 * This provides a simpler import path for components
 * 
 * @param source The name of the component or source
 * @param options Additional options for the logger
 */
export function useLogger(source?: string, options?: LoggerOptions) {
  return useLoggerOriginal(source, options);
}

/**
 * Type-only export to ensure consistent types
 */
export type { LoggerOptions };
export { LogCategory, LogLevel };
