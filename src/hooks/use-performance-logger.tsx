
import { usePerformanceLogger as usePerformanceLoggerOriginal, PerformanceLoggerOptions } from '@/logging/hooks/usePerformanceLogger';

export const usePerformanceLogger = usePerformanceLoggerOriginal;
export type { PerformanceLoggerOptions };
