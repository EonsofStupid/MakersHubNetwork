
import { LogCategory, LogLevel, LogDetails, LogEntry as SharedLogEntry, LogEvent as SharedLogEvent, LogFilter as SharedLogFilter } from '@/shared/types/shared.types';

// Re-export shared types with a more specific naming
export type { LogCategory, LogLevel, LogDetails };

// Extend the LogEntry for logging-specific functionality
export interface LogEntry extends SharedLogEntry {
  timestamp: number; // Override as number for the logging module
}

export interface LogEvent extends SharedLogEvent {
  type: string;
  entry: LogEntry;
}

export type LogFilter = SharedLogFilter;

export interface LogOptions {
  timestamp?: number;
  details?: LogDetails;
  source?: string;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  defaultCategory?: LogCategory;
  includeSource?: boolean;
  enableConsole?: boolean;
  enableStorage?: boolean;
  maxEntries?: number;
}

export interface Transport {
  log(entry: LogEntry): void;
  setMinLevel(level: LogLevel): void;
  getMinLevel(): LogLevel;
}

export type LogTransport = Transport; // Alias for backward compatibility

export interface TransportOptions {
  minLevel?: LogLevel;
  maxEntries?: number;
}
