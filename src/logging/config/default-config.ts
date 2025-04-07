
import { LoggingConfig, LogLevel, LogCategory } from '../types';
import { MemoryTransport } from '../transports/memory-transport';
import { ConsoleTransport } from '../transports/console-transport';

// Export default logging configuration
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.INFO,
  transports: [
    new MemoryTransport(),
    new ConsoleTransport()
  ],
  bufferSize: 20,
  flushInterval: 5000,
  includeSource: true,
  includeUser: false,
  includeSession: true,
  enabledCategories: Object.values(LogCategory) as LogCategory[]
};
