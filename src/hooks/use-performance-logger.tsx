
import { usePerformanceLogger as usePerformanceLoggerOriginal, PerformanceLoggerOptions } from '@/logging/hooks/usePerformanceLogger';

/**
 * Re-export the performance logger hook for use throughout the application.
 * This provides a centralized way to modify or extend the logger behavior if needed in the future.
 */
export const usePerformanceLogger = usePerformanceLoggerOriginal;
export type { PerformanceLoggerOptions };
