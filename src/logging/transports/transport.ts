
import { LogEntry } from '../types';

/**
 * Base transport interface for all log transports
 */
export interface Transport {
  log(entry: LogEntry): void;
  flush?(): Promise<void>;
  getLogs?(): LogEntry[];
  getFilteredLogs?(options?: any): LogEntry[];
  clear?(): void;
  subscribe?(callback: (logs: LogEntry[]) => void): () => void;
}
