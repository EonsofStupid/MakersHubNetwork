
/**
 * Log level enum - determines the severity of log messages
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  CRITICAL = 5,
  SUCCESS = 6
}

/**
 * Log category enum - used to categorize log messages by functional area
 */
export enum LogCategory {
  AUTH = 'AUTH',
  UI = 'UI',
  API = 'API',
  THEME = 'THEME',
  ROUTER = 'ROUTER',
  STATE = 'STATE',
  STORAGE = 'STORAGE',
  ERROR = 'ERROR',
  PERFORMANCE = 'PERFORMANCE',
  ADMIN = 'ADMIN',
  LIFECYCLE = 'LIFECYCLE',
  NETWORK = 'NETWORK',
  SYSTEM = 'SYSTEM',
  DATA = 'DATA',
  GENERAL = 'GENERAL',
  MISC = 'MISC',
  CONTENT = 'CONTENT'
}
