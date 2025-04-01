
/**
 * Logging system type definitions
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success' | 'trace';

export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  AUTH = 'auth',
  UI = 'ui',
  ADMIN = 'admin',
  CHAT = 'chat',
  DATABASE = 'database',
  PERFORMANCE = 'performance',
  CONTENT = 'content'  // Added this new category
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: unknown;
  source?: string;
  userId?: string;
  sessionId?: string;
  duration?: number; // For performance logs
  tags?: string[];
}

export interface LogTransport {
  log(entry: LogEntry): void;
  flush?(): Promise<void>;
}

export interface LoggingConfig {
  minLevel: LogLevel;
  enabledCategories?: LogCategory[];
  transports: LogTransport[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
}
