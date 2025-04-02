
import { toast } from '@/hooks/use-toast';
import { LogEntry, LogTransport } from '../types';
import { LogLevel } from '../constants/log-level';
import { nodeToSearchableString } from '@/shared/utils/react-utils';

interface UITransportOptions {
  showDebug?: boolean;
  showInfo?: boolean;
  showWarning?: boolean;
  showError?: boolean;
  showCritical?: boolean;
  throttleMs?: number;
}

/**
 * Transport for showing logs as UI toasts
 */
export class UITransport implements LogTransport {
  private options: UITransportOptions;
  private recentMessages: Map<string, { timestamp: number, count: number }> = new Map();
  
  constructor(options: UITransportOptions = {}) {
    this.options = {
      showDebug: false,
      showInfo: true,
      showWarning: true,
      showError: true,
      showCritical: true,
      throttleMs: 5000,
      ...options
    };
  }
  
  log(entry: LogEntry): void {
    // Check if we should show a toast for this log level
    if (!this.shouldShowToast(entry.level)) {
      return;
    }
    
    // Create a key for this message to track duplicates
    const messageStr = nodeToSearchableString(entry.message);
    const messageKey = `${entry.level}-${entry.category}-${messageStr}`;
    
    // Check if we're throttling this message
    if (this.isThrottled(messageKey)) {
      return;
    }
    
    // Show the toast
    this.showToast(entry);
  }
  
  private shouldShowToast(level: LogLevel): boolean {
    switch (level) {
      case LogLevel.DEBUG:
        return !!this.options.showDebug;
      case LogLevel.INFO:
        return !!this.options.showInfo;
      case LogLevel.WARN:
        return !!this.options.showWarning;
      case LogLevel.ERROR:
        return !!this.options.showError;
      case LogLevel.CRITICAL:
        return !!this.options.showCritical;
      default:
        return false;
    }
  }
  
  private isThrottled(messageKey: string): boolean {
    const now = Date.now();
    const recent = this.recentMessages.get(messageKey);
    
    if (recent) {
      // If the message was seen recently
      if (now - recent.timestamp < (this.options.throttleMs || 5000)) {
        // Update count and timestamp
        this.recentMessages.set(messageKey, {
          timestamp: now,
          count: recent.count + 1
        });
        return true;
      }
    }
    
    // Not throttled, record it
    this.recentMessages.set(messageKey, {
      timestamp: now,
      count: 1
    });
    
    // Clean up old messages
    this.cleanupOldMessages(now);
    
    return false;
  }
  
  private cleanupOldMessages(now: number): void {
    const expiryTime = now - ((this.options.throttleMs || 5000) * 2);
    
    for (const [key, data] of this.recentMessages.entries()) {
      if (data.timestamp < expiryTime) {
        this.recentMessages.delete(key);
      }
    }
  }
  
  private showToast(entry: LogEntry): void {
    let iconName: string;
    let variant: "default" | "destructive" | undefined;
    const title = this.getTitle(entry);
    const messageStr = nodeToSearchableString(entry.message);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        iconName = "info";
        variant = "default";
        break;
      case LogLevel.INFO:
        iconName = "info";
        variant = "default";
        break;
      case LogLevel.WARN:
        iconName = "alert-triangle";
        variant = "default";
        break;
      case LogLevel.ERROR:
        iconName = "alert-circle";
        variant = "destructive";
        break;
      case LogLevel.CRITICAL:
        iconName = "x-circle";
        variant = "destructive";
        break;
      default:
        iconName = "info";
        variant = "default";
    }
    
    // Show toast with appropriate styling
    toast({
      title,
      description: messageStr,
      variant,
      // Use plain strings for icon names - the toast component will handle rendering
      icon: iconName,
      duration: entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL ? 7000 : 4000,
    });
  }
  
  private getTitle(entry: LogEntry): string {
    switch (entry.level) {
      case LogLevel.DEBUG:
        return `Debug [${entry.category}]`;
      case LogLevel.INFO:
        return `Info [${entry.category}]`;
      case LogLevel.WARN:
        return `Warning [${entry.category}]`;
      case LogLevel.ERROR:
        return `Error [${entry.category}]`;
      case LogLevel.CRITICAL:
        return `Critical Error [${entry.category}]`;
      default:
        return `Log [${entry.category}]`;
    }
  }
}
