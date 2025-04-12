
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
  // Additional filter properties
  userId?: string;
  startTime?: number;
  endTime?: number;
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
  // Additional config properties
  defaultCategory?: LogCategory;
  transports?: string[];
}

export interface LogTransport {
  log: (entry: LogEntry) => void;
  dispose?: () => void;
  // Add these properties to fix errors
  minLevel?: LogLevel;
  details?: {
    excludeCategories?: LogCategory[];
  };
}

export { LogCategory, LogLevel };
