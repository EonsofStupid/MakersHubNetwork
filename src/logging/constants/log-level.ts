
/**
 * Log level enum representing different levels of logging
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  TRACE = 'trace',     // Adding missing TRACE level
  SUCCESS = 'success', // Adding missing SUCCESS level
  FATAL = 'fatal'      // Adding missing FATAL level
}

export default LogLevel;
