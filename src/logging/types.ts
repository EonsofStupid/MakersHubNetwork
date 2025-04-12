
// Re-export shared logging types
export { LogLevel, LogCategory, LogEntry, LogEvent } from '@/shared/types/shared.types';

// Logging specific types not shared with other boundaries
export interface LoggingConfig {
  minLevel: LogLevel;
  defaultCategory: LogCategory;
  enabledCategories: LogCategory[];
  transports?: LogTransport[];
}

export interface LogTransport {
  log(entry: LogEntry): void;
  clear(): void;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
  startTime?: Date;
  endTime?: Date;
}
