
import { useLogger as useLoggerOriginal } from '@/logging/hooks/useLogger';
import { LoggerOptions } from '@/logging/types';

/**
 * Re-export the useLogger hook from the logging module
 * This provides a simpler import path for components
 */
export const useLogger = useLoggerOriginal;

/**
 * Type-only export to ensure consistent types
 */
export type { LoggerOptions };
