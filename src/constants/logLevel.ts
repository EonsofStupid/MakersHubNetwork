
// Re-export log level and category constants from the canonical source
export * from '@/logging/types';

// Import needed types directly for backward compatibility
import { LogLevel, LogCategory } from '@/logging/types';
export { LogLevel, LogCategory };
