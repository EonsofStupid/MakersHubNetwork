
import { LogEntry, LogLevel } from '@/shared/types/shared.types';

/**
 * Base interface for all log transports
 */
export interface LogTransport {
  /**
   * Log an entry
   */
  log: (entry: LogEntry) => void;
  
  /**
   * Clear all logs
   */
  clear?: () => void;
  
  /**
   * Set the minimum log level
   */
  setMinLevel: (level: LogLevel) => void;
  
  /**
   * Get all logs (optional)
   */
  getLogs?: () => LogEntry[];
}
