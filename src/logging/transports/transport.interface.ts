
import { LogEntry, LogLevel } from '@/shared/types/shared.types';

/**
 * Interface for log transports (console, memory, file, etc)
 */
export interface Transport {
  log(entry: LogEntry): void;
  setMinLevel(level: LogLevel): void;
  getMinLevel(): LogLevel;
}
