
import { LogLevel, LogCategory } from "@/shared/types/shared.types";

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
  minLevel?: LogLevel;
  categories?: LogCategory[];
  source?: string;
}

export interface LogTransport {
  log(entry: LogEntry): void;
}

export interface LoggerOptions {
  source?: string;
  category?: LogCategory;
  transports?: LogTransport[];
  filter?: LogFilter;
}

export interface Logger {
  trace(message: string, details?: Record<string, unknown>): void;
  debug(message: string, details?: Record<string, unknown>): void;
  info(message: string, details?: Record<string, unknown>): void;
  success(message: string, details?: Record<string, unknown>): void;
  warn(message: string, details?: Record<string, unknown>): void;
  error(message: string, details?: Record<string, unknown>): void;
  fatal(message: string, details?: Record<string, unknown>): void;
}
