
// Export logger constants and utilities
export { LogCategory } from './constants/log-category';
export { LogLevel } from './constants/log-level';

// Export logger singleton
export const getLogger = () => {
  // For now, return a simple logging object
  // This would be replaced with an actual logger implementation
  return {
    debug: (message: string, options?: any) => console.debug(`[DEBUG] ${message}`, options),
    info: (message: string, options?: any) => console.info(`[INFO] ${message}`, options),
    warn: (message: string, options?: any) => console.warn(`[WARN] ${message}`, options),
    error: (message: string, options?: any) => console.error(`[ERROR] ${message}`, options),
    critical: (message: string, options?: any) => console.error(`[CRITICAL] ${message}`, options),
  };
};

// Export types
export type { LogEntry, LogTransport } from './types';
