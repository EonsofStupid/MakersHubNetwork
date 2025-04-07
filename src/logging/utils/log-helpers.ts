
import { LogCategory, LogOptions } from '../types';

/**
 * Helper to create log options with defaults
 */
export function createLogOptions(
  defaultCategory: LogCategory, 
  options?: Partial<Omit<LogOptions, 'category'>>
): LogOptions {
  return {
    category: defaultCategory,
    ...(options || {}),
  };
}
