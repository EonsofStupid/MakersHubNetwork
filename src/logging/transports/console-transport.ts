
import { LogEntry, LogTransport } from "../types";
import { LOG_LEVELS, LogLevel } from "../constants/log-level";

/**
 * Transport for logging to the browser console
 */
export class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const source = entry.source ? ` [${entry.source}]` : '';
    const category = entry.category ? `(${entry.category})` : '';
    const message = `${timestamp} ${this.getLevelPrefix(entry.level)}${category}${source}: ${entry.message}`;
    
    // Log with appropriate console method based on level
    switch (entry.level) {
      case LOG_LEVELS.DEBUG:
        console.debug(message, entry.details || '');
        break;
      case LOG_LEVELS.INFO:
        console.info(message, entry.details || '');
        break;
      case LOG_LEVELS.WARN:
        console.warn(message, entry.details || '');
        break;
      case LOG_LEVELS.ERROR:
      case LOG_LEVELS.CRITICAL:
        console.error(message, entry.details || '');
        break;
      default:
        console.log(message, entry.details || '');
    }
  }
  
  private getLevelPrefix(level: LogLevel): string {
    switch (level) {
      case LOG_LEVELS.DEBUG:
        return '[DEBUG] ';
      case LOG_LEVELS.INFO:
        return '[INFO] ';
      case LOG_LEVELS.WARN:
        return '[WARN] ';
      case LOG_LEVELS.ERROR:
        return '[ERROR] ';
      case LOG_LEVELS.CRITICAL:
        return '[CRITICAL] ';
      case LOG_LEVELS.SUCCESS:
        return '[SUCCESS] ';
      case LOG_LEVELS.TRACE:
        return '[TRACE] ';
      default:
        return '[LOG] ';
    }
  }
}
