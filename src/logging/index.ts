
// Main logging exports
export * from './logger.service';
export * from './bridge';
export type { 
  LogEntry,
  LogEvent,
  LogFilter,
  LogOptions,
  LoggerOptions
} from './types';
export { LogCategory, LogLevel } from '@/shared/types/shared.types'; // Export LogCategory and LogLevel directly
export { memoryTransport } from './transports/memory-transport';
