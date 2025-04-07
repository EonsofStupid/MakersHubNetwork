
import { ConsoleTransport } from './transports/console-transport';
import { UiTransport } from './transports/ui-transport';
import { MemoryTransport } from './transports/memory-transport';
import { LoggerConfig, LogLevel } from './types';

// Default configuration
const defaultConfig: LoggerConfig = {
  defaultLevel: LogLevel.INFO,
  transports: [
    new ConsoleTransport(),
    new UiTransport({ maxLogs: 200 }),
    new MemoryTransport({ maxLogs: 500 })
  ],
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
