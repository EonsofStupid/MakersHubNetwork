
import { LogEntry, LogLevel, LOG_LEVEL_VALUES } from '@/shared/types';
import { type LogTransport } from '../types';

// Toast providers may vary across projects
type ToastFunction = (options: any) => void;

interface UiTransportConfig {
  toastFn?: ToastFunction;
  consoleEnabled?: boolean;
}

export class UiTransport implements LogTransport {
  private toastFn?: ToastFunction;
  private consoleEnabled: boolean;
  private minLevel: LogLevel = LogLevel.INFO;
  
  constructor(config: UiTransportConfig = {}) {
    this.toastFn = config.toastFn;
    this.consoleEnabled = config.consoleEnabled ?? true;
  }
  
  public log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }
    
    // Log to console if enabled
    if (this.consoleEnabled) {
      this.logToConsole(entry);
    }
    
    // Show toast if toast function provided
    if (this.toastFn) {
      this.showToast(entry);
    }
  }
  
  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levelValues: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      success: 2,
      warn: 3,
      error: 4,
      critical: 5,
      fatal: 6,
      trace: -1,
      silent: 100 // Adding silent level
    };
    
    return levelValues[level] >= levelValues[this.minLevel];
  }
  
  private logToConsole(entry: LogEntry): void {
    const { level, message, details, timestamp, category } = entry;
    const time = new Date(timestamp).toLocaleTimeString();
    const prefix = `[${time}][${category}][${level}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${message}`, details);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${message}`, details);
        break;
      case LogLevel.SUCCESS:
        console.log(`%c${prefix} ${message}`, 'color: green', details);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${message}`, details);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        console.error(`${prefix} ${message}`, details);
        break;
      case LogLevel.TRACE:
        console.trace(`${prefix} ${message}`, details);
        break;
    }
  }
  
  private showToast(entry: LogEntry): void {
    if (!this.toastFn) return;
    
    const { level, message, details } = entry;
    
    const toastOptions: Record<string, any> = {
      title: this.getToastTitle(level),
      description: message,
      duration: this.getToastDuration(level),
    };
    
    // Add variant based on level
    toastOptions.variant = this.getToastVariant(level);
    
    // Add action if there are details to show
    if (details && Object.keys(details).length > 0) {
      toastOptions.action = {
        label: 'Details',
        onClick: () => console.info('Log details:', details)
      };
    }
    
    this.toastFn(toastOptions);
  }
  
  private getToastVariant(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        return 'destructive';
      case LogLevel.WARN:
        return 'warning';
      case LogLevel.SUCCESS:
        return 'success';
      case LogLevel.INFO:
        return 'info';
      default:
        return 'default';
    }
  }
  
  private getToastTitle(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return 'Error';
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        return 'Critical Error';
      case LogLevel.WARN:
        return 'Warning';
      case LogLevel.SUCCESS:
        return 'Success';
      case LogLevel.INFO:
        return 'Information';
      case LogLevel.DEBUG:
        return 'Debug';
      case LogLevel.TRACE:
        return 'Trace';
      default:
        return 'Log';
    }
  }
  
  private getToastDuration(level: LogLevel): number {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        return 8000; // Errors shown longer
      case LogLevel.WARN:
        return 5000;
      default:
        return 3000;
    }
  }

  // Expose name property for identification
  public get name(): string {
    return 'ui';
  }
}
