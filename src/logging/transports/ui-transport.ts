
import { LogEntry, LogLevel, LogTransport } from "../types";
import { toast } from "@/hooks/use-toast";

/**
 * UI Transport for displaying logs as toast notifications
 */
export class UITransport implements LogTransport {
  private throttleMap = new Map<string, number>();
  
  constructor(private options: {
    showDebug?: boolean;
    showInfo?: boolean;
    showWarning?: boolean;
    showError?: boolean;
    showCritical?: boolean;
    throttleMs?: number;
  } = {
    showDebug: false,
    showInfo: true,
    showWarning: true,
    showError: true,
    showCritical: true,
    throttleMs: 1000 // Default throttle of 1 second
  }) {}

  log(entry: LogEntry): void {
    // Check if we should show this log level
    if (!this.shouldShowLevel(entry.level)) {
      return;
    }
    
    // Create a key for throttling similar messages
    const throttleKey = `${entry.level}-${entry.category}-${entry.message}`;
    
    // Check if we're throttling this message
    if (this.isThrottled(throttleKey)) {
      return;
    }
    
    // Show toast based on log level
    this.showToast(entry);
    
    // Set throttle
    this.setThrottle(throttleKey);
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
  
  private isThrottled(key: string): boolean {
    const lastShown = this.throttleMap.get(key);
    return lastShown !== undefined && 
           Date.now() - lastShown < (this.options.throttleMs || 1000);
  }
  
  private setThrottle(key: string): void {
    this.throttleMap.set(key, Date.now());
    
    // Clean up old entries
    if (this.throttleMap.size > 100) {
      const now = Date.now();
      for (const [k, time] of this.throttleMap.entries()) {
        if (now - time > 30000) { // Remove entries older than 30 seconds
          this.throttleMap.delete(k);
        }
      }
    }
  }
  
  private showToast(entry: LogEntry): void {
    const variant = this.getVariantForLevel(entry.level);
    const duration = this.getDurationForLevel(entry.level);
    const className = this.getClassNameForLevel(entry.level);
    
    toast({
      title: this.getTitleForEntry(entry),
      description: entry.message,
      variant,
      duration,
      className,
    });
  }
  
  private getTitleForEntry(entry: LogEntry): string {
    switch (entry.level) {
      case LogLevel.DEBUG:
        return `Debug: ${entry.category}`;
      case LogLevel.INFO:
        return `Info: ${entry.category}`;
      case LogLevel.WARNING:
        return `Warning: ${entry.category}`;
      case LogLevel.ERROR:
        return `Error: ${entry.category}`;
      case LogLevel.CRITICAL:
        return `CRITICAL: ${entry.category}`;
      default:
        return `${entry.category}`;
    }
  }
  
  private getVariantForLevel(level: LogLevel): "default" | "destructive" {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return "destructive";
      default:
        return "default";
    }
  }
  
  private getDurationForLevel(level: LogLevel): number {
    switch (level) {
      case LogLevel.DEBUG:
        return 3000;
      case LogLevel.INFO:
        return 5000;
      case LogLevel.WARNING:
        return 7000;
      case LogLevel.ERROR:
        return 10000;
      case LogLevel.CRITICAL:
        return 0; // 0 means don't auto-dismiss
      default:
        return 5000;
    }
  }
  
  private getClassNameForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "log-debug"; 
      case LogLevel.INFO:
        return "log-info electric-hover";
      case LogLevel.WARNING:
        return "log-warning electric-border";
      case LogLevel.ERROR:
        return "log-error text-glitch-hover";
      case LogLevel.CRITICAL:
        return "log-critical text-glitch";
      default:
        return "";
    }
  }
}
