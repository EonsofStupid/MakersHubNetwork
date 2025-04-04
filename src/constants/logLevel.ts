
/**
 * Log levels as const enum pattern
 */
export const LogLevel = {
  TRACE: 'TRACE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
  SUCCESS: 'SUCCESS',
  CRITICAL: 'CRITICAL'
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/**
 * Log categories as const enum pattern
 */
export const LogCategory = {
  GENERAL: 'general',
  UI: 'ui',
  AUTH: 'auth',
  API: 'api',
  DATABASE: 'database',
  FEATURE: 'feature',
  THEME: 'theme',
  ADMIN: 'admin',
  CONTENT: 'content',
  SYSTEM: 'system',
  PERFORMANCE: 'performance',
  DATA: 'data',
  NETWORK: 'network',
  ERROR: 'error'
} as const;

export type LogCategory = typeof LogCategory[keyof typeof LogCategory];
