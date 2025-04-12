
import { LogLevel } from './constants/log-level';
import { LogCategory } from './constants/log-category';

export interface LogEntryOptions {
  category?: LogCategory;
  details?: Record<string, unknown>;
  timestamp?: number;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  category: LogCategory;
  timestamp: number;
  source?: string;
  details?: Record<string, unknown>;
}

export interface LoggingConfig {
  minLevel: LogLevel;
  enabledCategories: LogCategory[];
  debugMode: boolean;
  showSourceInConsole: boolean;
  showTimestampInConsole: boolean;
  filters: {
    showDebug: boolean;
    showInfo: boolean;
    showWarning: boolean;
    showError: boolean;
    showCritical: boolean;
  };
}

export interface LogTransport {
  log(entry: LogEntry): void;
  clear(): void;
}
