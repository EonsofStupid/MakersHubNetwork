
// Re-export all logging types with proper export type syntax
export { LogLevel, LogCategory, type LogDetails } from '@/shared/types/shared.types';

// Logger related types
export interface LoggerOptions {
  level: LogLevel;
  categories?: LogCategory[];
  includeTimestamp?: boolean;
}

export interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: string;
  details?: LogDetails;
}
