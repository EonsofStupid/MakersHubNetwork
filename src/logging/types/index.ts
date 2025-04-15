
// Re-export shared logging types
import {
  LogLevel,
  LogCategoryType,
  LogCategory,
  LogDetails,
  LogEntry,
  LogEvent,
  LogFilter
} from '@/shared/types/shared.types';

export type {
  LogCategoryType,
  LogDetails,
  LogEntry,
  LogEvent,
  LogFilter
};

// Export LogCategory and LogLevel enums
export { LogLevel, LogCategory };

// Logger related types
export interface LoggerOptions {
  level: LogLevel;
  categories?: LogCategoryType[];
  includeTimestamp?: boolean;
}

// LogTransport interface
export interface LogTransport {
  log: (entry: LogEntry) => void;
  setLevel: (level: LogLevel) => void;
}
