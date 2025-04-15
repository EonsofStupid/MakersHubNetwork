
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/shared.types';

export { LogCategory, LogLevel, LogDetails };

export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: number;
  details?: LogDetails;
  source?: string;
}

export interface LogTransport {
  log: (entry: LogEntry) => void;
  clear: () => void;
  setMinLevel: (level: LogLevel) => void;
}
