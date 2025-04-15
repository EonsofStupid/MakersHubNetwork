
// Re-export shared logging types
export type { 
  LogLevel,
  LogCategoryType,
  LogDetails,
  LogEntry,
  LogEvent,
  LogFilter
} from '@/shared/types/shared.types';

// Export LogCategory
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
  setMinLevel: (level: LogLevel) => void;
}
