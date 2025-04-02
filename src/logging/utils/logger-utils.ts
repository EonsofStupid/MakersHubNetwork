
import { LogLevel, LogCategory } from '../index';
import { LOG_LEVEL_NAMES } from '../constants/log-level';
import { getLogLevelFromString } from './map-log-level';
import { LogEntry } from '../types';

/**
 * Format a log entry into a readable string
 */
export function formatLogEntry(entry: LogEntry): string {
  const timestamp = entry.timestamp instanceof Date 
    ? entry.timestamp.toISOString() 
    : new Date(entry.timestamp).toISOString();
  
  const level = LOG_LEVEL_NAMES[entry.level];
  const message = String(entry.message);
  
  return `[${timestamp}] [${level}] [${entry.category}] ${message}`;
}

/**
 * Extract log level from environment variables or default to INFO
 */
export function getEnvironmentLogLevel(): LogLevel {
  const envLevel = typeof window !== 'undefined' 
    ? window.localStorage.getItem('LOG_LEVEL') 
    : process.env.LOG_LEVEL;
  
  return envLevel ? getLogLevelFromString(envLevel) : LogLevel.INFO;
}

/**
 * Create a scoped logger name with optional context
 */
export function createLoggerName(component: string, context?: string): string {
  return context ? `${component}:${context}` : component;
}

/**
 * Sanitize log details to prevent sensitive data leakage
 */
export function sanitizeLogDetails(details: Record<string, unknown>): Record<string, unknown> {
  // Create a copy to avoid mutating the original
  const sanitized = { ...details };
  
  // Remove sensitive keys
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'apiKey', 'credentials'];
  
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * Creates consistent log tags for filtering
 */
export function createLogTags(
  category: LogCategory, 
  component: string, 
  additionalTags: string[] = []
): string[] {
  const baseTags = [category, component];
  return [...baseTags, ...additionalTags];
}
