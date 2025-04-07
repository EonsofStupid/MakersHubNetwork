
import { ConsoleTransport } from './transports/console-transport';
import { UiTransport } from './transports/ui-transport';
import { MemoryTransport } from './transports/memory-transport';
import { LoggerConfig, LogLevel, LogCategory } from './types';

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  transports: [
    new ConsoleTransport(),
    new UiTransport({ maxLogs: 200 }),
    new MemoryTransport({ maxLogs: 500 })
  ],
  enableConsole: true,
  bufferSize: 50,
  defaultCategory: LogCategory.SYSTEM,
  defaultSource: 'app',
  context: {},
};

// Export configuration
export const loggerConfig: LoggerConfig = {
  ...defaultConfig,
};

// Allow runtime configuration
export function configureLogger(config: Partial<LoggerConfig>): void {
  Object.assign(loggerConfig, {
    ...loggerConfig,
    ...config,
    context: {
      ...loggerConfig.context,
      ...config.context,
    }
  });
}
