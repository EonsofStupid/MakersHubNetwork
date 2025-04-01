
import { LogEntry, LogLevel, LogTransport } from "../types";

/**
 * Console transport for outputting logs to browser console
 */
export class ConsoleTransport implements LogTransport {
  constructor(private options: {
    colorized?: boolean;
    includeTimestamp?: boolean;
    formatDetails?: boolean;
  } = {
    colorized: true,
    includeTimestamp: true,
    formatDetails: true
  }) {}

  log(entry: LogEntry): void {
    const timestamp = this.options.includeTimestamp 
      ? `[${entry.timestamp.toISOString()}] `
      : '';
    
    const category = `[${entry.category.toUpperCase()}] `;
    const source = entry.source ? `[${entry.source}] ` : '';
    const message = `${timestamp}${category}${source}${entry.message}`;
    
    if (this.options.colorized) {
      this.logColorized(entry, message);
    } else {
      this.logPlain(entry, message);
    }
  }

  private logColorized(entry: LogEntry, message: string): void {
    const styles = this.getStylesForLevel(entry.level);
    
    if (entry.details) {
      console.groupCollapsed(`%c${message}`, styles);
      if (this.options.formatDetails) {
        console.dir(entry.details);
      } else {
        console.log(entry.details);
      }
      console.groupEnd();
    } else {
      console.log(`%c${message}`, styles);
    }
  }

  private logPlain(entry: LogEntry, message: string): void {
    const method = this.getLogMethodForLevel(entry.level);
    
    if (entry.details) {
      console.groupCollapsed(message);
      console.log(entry.details);
      console.groupEnd();
    } else {
      console[method](message);
    }
  }

  private getStylesForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #888; font-weight: normal;';
      case LogLevel.INFO:
        return 'color: #00F0FF; font-weight: normal;';
      case LogLevel.WARNING:
        return 'color: #FFB400; font-weight: bold;';
      case LogLevel.ERROR:
        return 'color: #FF2D6E; font-weight: bold;';
      case LogLevel.CRITICAL:
        return 'color: #FF2D6E; font-weight: bold; font-size: 1.1em; text-decoration: underline;';
      default:
        return 'color: inherit;';
    }
  }

  private getLogMethodForLevel(level: LogLevel): 'log' | 'info' | 'warn' | 'error' {
    switch (level) {
      case LogLevel.DEBUG:
        return 'log';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARNING:
        return 'warn';
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return 'error';
      default:
        return 'log';
    }
  }
}
