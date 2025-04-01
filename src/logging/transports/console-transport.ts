
import { LogEntry, LogTransport } from "../types";
import { LogLevel } from "../constants/log-level";

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
      case LogLevel.DEBUG:
        console.debug(message, entry.details || '');
        break;
      case LogLevel.INFO:
        console.info(message, entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(message, entry.details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(message, entry.details || '');
        break;
      default:
        console.log(message, entry.details || '');
    }
  }
  
  private getLevelPrefix(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '[DEBUG] ';
      case LogLevel.INFO:
        return '[INFO] ';
      case LogLevel.WARN:
        return '[WARN] ';
      case LogLevel.ERROR:
        return '[ERROR] ';
      case LogLevel.CRITICAL:
        return '[CRITICAL] ';
      case LogLevel.SUCCESS:
        return '[SUCCESS] ';
      case LogLevel.TRACE:
        return '[TRACE] ';
      default:
        return '[LOG] ';
    }
  }
}
