
import { LogEntry, LogLevel, LogTransport } from "../types";
import { toast } from "@/components/ui/use-toast";
import { alertToast } from "../components/LogNotification";

interface UITransportOptions {
  showDebug?: boolean;
  showInfo?: boolean;
  showWarning?: boolean;
  showError?: boolean;
  showCritical?: boolean;
  throttleMs?: number;
}

/**
 * Transport for displaying logs in the UI via toasts
 */
export class UITransport implements LogTransport {
  private options: UITransportOptions;
  private lastMessages: Map<string, { timestamp: number, count: number }> = new Map();
  
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
    // Determine if we should show this log level
    if (!this.shouldShowLevel(entry.level)) {
      return;
    }
    
    // Create a key for the message to track duplicates
    const messageKey = `${entry.level}-${entry.category}-${entry.message}`;
    
    // Check for throttling
    if (this.options.throttleMs && this.options.throttleMs > 0) {
      const now = Date.now();
      const lastMessage = this.lastMessages.get(messageKey);
      
      if (lastMessage) {
        // If within throttle window, increment count and skip showing
        if (now - lastMessage.timestamp < this.options.throttleMs) {
          this.lastMessages.set(messageKey, {
            timestamp: lastMessage.timestamp,
            count: lastMessage.count + 1
          });
          return;
        }
        
        // If outside throttle window, update with new timestamp and show with count
        this.lastMessages.set(messageKey, { timestamp: now, count: 1 });
        
        // If we had multiple of the same message, show with count
        if (lastMessage.count > 1) {
          this.showToast(entry, `(${lastMessage.count}x)`);
          return;
        }
      } else {
        // First time seeing this message
        this.lastMessages.set(messageKey, { timestamp: now, count: 1 });
      }
    }
    
    // Show the toast
    this.showToast(entry);
  }
  
  private shouldShowLevel(level: LogLevel): boolean {
    switch (level) {
      case LogLevel.DEBUG:
        return this.options.showDebug || false;
      case LogLevel.INFO:
        return this.options.showInfo || false;
      case LogLevel.WARNING:
        return this.options.showWarning || false;
      case LogLevel.ERROR:
        return this.options.showError || false;
      case LogLevel.CRITICAL:
        return this.options.showCritical || false;
      default:
        return false;
    }
  }
  
  private showToast(entry: LogEntry, suffix = ''): void {
    const suffixText = suffix ? ` ${suffix}` : '';
    
    switch (entry.level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        alertToast({
          title: `${this.getLevelName(entry.level)}: ${entry.category}${suffixText}`,
          description: entry.message,
          variant: "destructive",
          duration: 6000,
        });
        break;
      case LogLevel.WARNING:
        alertToast({
          title: `${this.getLevelName(entry.level)}: ${entry.category}${suffixText}`,
          description: entry.message,
          variant: "warning",
          duration: 5000,
        });
        break;
      case LogLevel.INFO:
        if (this.options.showInfo) {
          toast({
            title: `${entry.category}${suffixText}`,
            description: entry.message,
            duration: 3000,
          });
        }
        break;
      case LogLevel.DEBUG:
        if (this.options.showDebug) {
          toast({
            title: `Debug: ${entry.category}${suffixText}`,
            description: entry.message,
            variant: "secondary",
            duration: 2000,
          });
        }
        break;
    }
  }
  
  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'Debug';
      case LogLevel.INFO:
        return 'Info';
      case LogLevel.WARNING:
        return 'Warning';
      case LogLevel.ERROR:
        return 'Error';
      case LogLevel.CRITICAL:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }
}
