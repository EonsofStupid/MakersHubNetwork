
/**
 * Logging system type definitions
 */

import { LogLevel } from './constants/log-level';
import React from 'react';

export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  AUTH = 'auth',
  UI = 'ui',
  ADMIN = 'admin',
  CHAT = 'chat',
  DATABASE = 'database',
  PERFORMANCE = 'performance',
  CONTENT = 'content'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string | React.ReactNode;
  details?: Record<string, unknown>;
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

// Re-export LogLevel for backward compatibility
export { LogLevel } from './constants/log-level';
