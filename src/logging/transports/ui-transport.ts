
import { LogEntry, LogLevel } from '../types';
import { LogTransport } from '../types';
import { isLogLevelAtLeast } from '../utils/map-log-level';
import { nodeToSearchableString } from '@/shared/rendering';

interface UiTransportOptions {
  /**
   * Minimum log level to display in UI
   */
  minLevel?: LogLevel;
}

/**
 * A log transport that displays logs in the UI
 * This is useful for showing important logs to users
 */
export class UiTransport implements LogTransport {
  private options: Required<UiTransportOptions>;
  private notifications: Map<string, any> = new Map();
  
  constructor(options: UiTransportOptions = {}) {
    this.options = {
      minLevel: options.minLevel ?? LogLevel.INFO,
    };
  }
  
  /**
   * Process a log entry and display in UI if appropriate
   */
  log(entry: LogEntry): void {
    // Skip entries below minimum level
    if (!isLogLevelAtLeast(entry.level, this.options.minLevel)) {
      return;
    }
    
    // Skip entries without UI notification flag
    if (!this.shouldDisplayInUi(entry)) {
      return;
    }
    
    // Display in UI
    this.displayNotification(entry);
  }
  
  /**
   * Determine if entry should be displayed in UI
   */
  private shouldDisplayInUi(entry: LogEntry): boolean {
    // Always show errors and critical logs
    if (entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL) {
      return true;
    }
    
    // Show explicit success messages
    if (entry.level === LogLevel.SUCCESS || entry.success) {
      return true;
    }
    
    // Show warnings based on warning flag or level
    if (entry.level === LogLevel.WARN || entry.warning) {
      return true;
    }
    
    // Check for notification flag in details
    if (entry.details && (entry.details.notify || entry.details.notification)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Display notification in UI
   * This implementation uses console, but would be replaced with toast or notification component
   */
  private displayNotification(entry: LogEntry): void {
    const message = nodeToSearchableString(entry.message);
    
    // For demo, just log to console
    // In a real implementation, would use a toast or notification component
    switch (entry.level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(`[UI] ${message}`);
        break;
      case LogLevel.WARN:
        console.warn(`[UI] ${message}`);
        break;
      case LogLevel.SUCCESS:
        console.info(`[UI] ${message}`);
        break;
      default:
        console.log(`[UI] ${message}`);
    }
  }
}

// Create singleton instance
export const uiTransport = new UiTransport();
