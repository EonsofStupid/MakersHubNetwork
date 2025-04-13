
import { 
  LogCategory, 
  LogLevel, 
  LogEntry as SharedLogEntry, 
  LogEvent as SharedLogEvent, 
  LogFilter 
} from '@/shared/types/shared.types';

// Re-export the shared types for convenience
export type { LogCategory, LogLevel, LogFilter };

// Extend the shared LogEntry with additional fields specific to this implementation
export interface LogEntry extends Omit<SharedLogEntry, 'timestamp'> {
  // Override timestamp to allow string format for serialization
  timestamp: Date | string;
}

// Extend the shared LogEvent if needed
export interface LogEvent extends Omit<SharedLogEvent, 'entry'> {
  entry: LogEntry;
}

// Transport interface for log output destinations
export interface LogTransport {
  name: string;
  log(entry: LogEntry): void;
  setMinLevel(level: LogLevel): void;
  getMinLevel(): LogLevel;
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
}

// Configuration for logger
export interface LoggerConfig {
  minLevel: LogLevel;
  enabledCategories?: LogCategory[];
  disabledCategories?: LogCategory[];
  transports?: LogTransport[];
}

// Stats for log monitoring
export interface LogStats {
  totalLogs: number;
  byLevel: Record<LogLevel, number>;
  byCategory: Record<LogCategory, number>;
}
