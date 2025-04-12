
import { LogEntry, LogLevel, Transport } from '../types';
import { LOG_LEVEL_VALUES } from '@/shared/types/shared.types';

export class ConsoleTransport implements Transport {
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  log(entry: LogEntry): void {
    if (LOG_LEVEL_VALUES[entry.level] < LOG_LEVEL_VALUES[this.minLevel]) {
      return;
    }

    const timestamp = new Date(entry.timestamp).toISOString();
    const logPrefix = `${timestamp} [${entry.level.toUpperCase()}] (${entry.category}):`;

    switch (entry.level) {
      case LogLevel.TRACE:
        console.trace(logPrefix, entry.message, entry.details || '');
        break;
      case LogLevel.DEBUG:
        console.debug(logPrefix, entry.message, entry.details || '');
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(logPrefix, entry.message, entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(logPrefix, entry.message, entry.details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
      case LogLevel.CRITICAL:
        console.error(logPrefix, entry.message, entry.details || '');
        break;
      default:
        console.log(logPrefix, entry.message, entry.details || '');
    }
  }
}
