
import { LogEntry, LogLevel } from '@/shared/types';

/**
 * Log transport interface for different logging destinations
 */
export interface LogTransport {
  log: (entry: LogEntry) => void;
  setMinLevel: (level: LogLevel) => void;
}
