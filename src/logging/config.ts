
import { LogLevel } from '@/shared/types/shared.types';

/**
 * Logging configuration
 */
export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enablePersistence: boolean;
  persistenceKey?: string;
  maxLogEntries?: number;
}

/**
 * Default logging configuration
 */
export const defaultLoggerConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enablePersistence: true,
  persistenceKey: 'app_logs',
  maxLogEntries: 1000,
};

/**
 * Development logging configuration
 */
export const developmentLoggerConfig: LoggerConfig = {
  minLevel: LogLevel.DEBUG,
  enableConsole: true,
  enablePersistence: true,
  persistenceKey: 'app_logs_dev',
  maxLogEntries: 5000,
};

/**
 * Production logging configuration
 */
export const productionLoggerConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: false,
  enablePersistence: true,
  persistenceKey: 'app_logs_prod',
  maxLogEntries: 500,
};

/**
 * Get the appropriate logger configuration based on the environment
 */
export const getLoggerConfig = (): LoggerConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? productionLoggerConfig : developmentLoggerConfig;
};
