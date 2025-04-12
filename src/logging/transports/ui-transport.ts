
import { LogEntry, LogLevel, LogCategory } from '@/shared/types/shared.types';
import { LOG_LEVEL_VALUES } from '../constants/log-level';

type NotificationType = 'toast' | 'banner' | 'console';

interface UITransportOptions {
  minLevel: LogLevel;
  showInConsole?: boolean;
  showToasts?: boolean;
  categories?: LogCategory[];
}

/**
 * Transport for displaying logs in the UI
 */
export class UITransport {
  private options: UITransportOptions;
  private toastHandler?: (entry: LogEntry) => void;
  private bannerHandler?: (entry: LogEntry) => void;

  constructor(options: UITransportOptions) {
    this.options = {
      minLevel: LogLevel.INFO,
      showInConsole: true,
      showToasts: true,
      ...options,
    };
  }

  log(entry: LogEntry): void {
    // Check if we should process this log
    if (!this.shouldProcess(entry)) {
      return;
    }

    // Handle based on level and configuration
    if (this.options.showInConsole) {
      this.logToConsole(entry);
    }

    // Show UI notifications for important logs
    if (this.options.showToasts && 
        LOG_LEVEL_VALUES[entry.level] >= LOG_LEVEL_VALUES[LogLevel.WARN]) {
      this.showToast(entry);
    }

    // Show banner for critical errors
    if (entry.level === LogLevel.CRITICAL) {
      this.showBanner(entry);
    }
  }

  // Required by LogTransport interface
  clear(): void {
    // No persistent storage to clear
  }

  private shouldProcess(entry: LogEntry): boolean {
    // Check if level is high enough to process
    if (LOG_LEVEL_VALUES[entry.level] < LOG_LEVEL_VALUES[this.options.minLevel]) {
      return false;
    }

    // Check if category is included
    if (this.options.categories && 
        !this.options.categories.includes(entry.category)) {
      return false;
    }

    return true;
  }

  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.level.toUpperCase()}] [${entry.category}] ${entry.source ? `[${entry.source}]` : ''}`;
    const message = typeof entry.message === 'string' ? entry.message : entry.message;
    const details = entry.details ? entry.details : undefined;

    switch (entry.level) {
      case LogLevel.DEBUG:
      case LogLevel.TRACE:
        console.debug(prefix, message, details);
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(prefix, message, details);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, details);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, message, details);
        break;
    }
  }

  setToastHandler(handler: (entry: LogEntry) => void): void {
    this.toastHandler = handler;
  }

  setBannerHandler(handler: (entry: LogEntry) => void): void {
    this.bannerHandler = handler;
  }

  private showToast(entry: LogEntry): void {
    if (this.toastHandler) {
      this.toastHandler(entry);
    }
  }

  private showBanner(entry: LogEntry): void {
    if (this.bannerHandler) {
      this.bannerHandler(entry);
    }
  }
}

// Default UI transport with typical settings
export const uiTransport = new UITransport({
  minLevel: LogLevel.INFO,
  showInConsole: true,
  showToasts: true,
});
