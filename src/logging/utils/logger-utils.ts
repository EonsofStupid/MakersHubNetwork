
import { LogLevel, LogCategory } from '../types';
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
  let messageStr: string;
  
  if (typeof entry.message === 'string') {
    messageStr = entry.message;
  } else if (typeof entry.message === 'number' || typeof entry.message === 'boolean') {
    messageStr = String(entry.message);
  } else {
    messageStr = '[React Node]';
  }
  
  return `[${timestamp}] [${level}] [${entry.category}] ${messageStr}`;
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

/**
 * Safe converter for React nodes to strings for searching
 */
export function nodeToSearchableString(message: string | number | boolean | React.ReactNode): string {
  if (typeof message === 'string') {
    return message;
  } else if (typeof message === 'number' || typeof message === 'boolean') {
    return String(message);
  } else {
    return '[React Node]';
  }
}

/**
 * Safely render a React node or convert primitive values to strings
 */
export function safelyRenderNode(message: string | number | boolean | React.ReactNode): React.ReactNode {
  if (typeof message === 'string' || typeof message === 'number' || typeof message === 'boolean') {
    return String(message);
  } else if (React.isValidElement(message)) {
    return message;
  } else {
    return String(message);
  }
}
