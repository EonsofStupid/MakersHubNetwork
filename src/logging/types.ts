
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

export interface LogOptions {
  timestamp?: number;
  details?: LogDetails;
  source?: string;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  category: LogCategory;
  timestamp: number;
  source?: string;
  details?: LogDetails;
}

export interface LogEvent {
  type: string;
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  search?: string;
  userId?: string;
  startTime?: Date;
  endTime?: Date;
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

export interface TransportOptions {
  minLevel?: LogLevel;
  maxEntries?: number;
}
