
import { LogCategory } from './constants/log-category';
import { LogLevel } from './constants/log-level';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  category: LogCategory;
  details?: Record<string, unknown>;
}

export interface LogEvent {
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
}

export interface LoggingConfig {
  minLevel: LogLevel;
  enabled: boolean;
  categories: Record<LogCategory, boolean>;
  detailed: boolean;
  source: string;
  console: boolean;
  ui: boolean;
  remoteLogging: boolean;
}

export interface LogTransport {
  log: (entry: LogEntry) => void;
  dispose?: () => void;
}

export { LogCategory, LogLevel };
