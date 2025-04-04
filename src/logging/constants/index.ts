
// Re-export all logging constants
export * from './logLevel';

// Export centralized log configuration values
export const LOG_FLUSH_INTERVAL = 5000; // 5 seconds
export const LOG_BUFFER_SIZE = 10;
export const LOG_DEFAULT_SOURCE = 'App';

// Export log category filters
export const SYSTEM_LOG_CATEGORIES = [
  'system',
  'auth',
  'database',
  'api',
  'network',
];

export const UI_LOG_CATEGORIES = [
  'ui',
  'theme',
  'user-action',
  'performance',
];
