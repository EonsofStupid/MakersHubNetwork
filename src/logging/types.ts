
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
  DATA = 'data',
  PERFORMANCE = 'performance',
  CHAT = 'chat',
  DATABASE = 'database',
  CONTENT = 'content',
  GENERAL = 'general'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string | number | boolean | React.ReactNode;
  source?: string;
  details?: Record<string, unknown>;
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

// Define the callback type for log events
export type LogEventCallback = (entry: LogEntry) => void;

// Re-export LogLevel for backward compatibility
export { LogLevel } from './constants/log-level';
