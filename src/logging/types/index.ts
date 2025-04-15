
// Re-export shared logging types
export type { 
  LogCategoryType,
  LogDetails,
  LogEntry,
  LogEvent,
  LogFilter,
  LogLevel
} from '@/shared/types/shared.types';

// Export LogCategory and LogLevel constants
export { LogLevel, LogCategory } from '@/shared/types/shared.types';

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
