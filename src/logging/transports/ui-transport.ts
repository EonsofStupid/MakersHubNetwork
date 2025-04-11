
import { LogEntry, LogTransport, LogCategory, LogLevel, LogFilterOptions } from '../types';
import { toast } from '@/hooks/use-toast';
import { renderUnknownAsNode, nodeToSearchableString } from '@/shared/utils/render';

/**
 * UI Transport for showing logs in the UI
 */
export class UITransport implements LogTransport {
  private options: {
    showDebug?: boolean;
    showInfo?: boolean;
    showWarning?: boolean; 
    showError?: boolean;
    showCritical?: boolean;
  };
  
  constructor(options: {
    showDebug?: boolean;
    showInfo?: boolean;
    showWarning?: boolean; 
    showError?: boolean;
    showCritical?: boolean;
  } = {}) {
    this.options = {
      showDebug: false,
      showInfo: true,
      showWarning: true,
      showError: true,
      showCritical: true,
      ...options
    };
  }
  
  /**
   * Log entry to UI
   */
  log(entry: LogEntry): void {
    const { level, message, category, details } = entry;
    
    // Only show certain log levels in UI
    if (!this.shouldShowLevel(level)) {
      return;
    }
    
    // Format message for toast
    const formattedMessage = typeof message === 'string' ? message : nodeToSearchableString(message);
    
    // Don't show UI notifications for certain categories
    if (this.shouldSkipCategory(category)) {
      return;
    }
    
    // Show toast with appropriate variant
    this.showToast(level, formattedMessage, category, details);
  }
  
  /**
   * Determine if this level should be shown
   */
  private shouldShowLevel(level: LogLevel): boolean {
    switch (level) {
      case LogLevel.DEBUG:
        return !!this.options.showDebug;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
      case LogLevel.TRACE:
        return !!this.options.showInfo;
      case LogLevel.WARN:
        return !!this.options.showWarning;
      case LogLevel.ERROR:
        return !!this.options.showError;
      case LogLevel.CRITICAL:
        return !!this.options.showCritical;
      default:
        return true;
    }
  }
  
  /**
   * Determine if we should skip showing this category
   */
  private shouldSkipCategory(category?: LogCategory): boolean {
    // Skip certain categories from UI notifications
    const silentCategories = [
      LogCategory.PERFORMANCE,
      LogCategory.ANALYTICS
    ];
    
    return !!category && silentCategories.includes(category);
  }
  
  /**
   * Show a toast with the log message
   */
  private showToast(level: LogLevel, message: string, category?: LogCategory, details?: Record<string, any>): void {
    const title = this.getLevelTitle(level);
    const variant = this.getLevelVariant(level);
    const icon = this.getLevelIcon(level);
    
    // Only show toast for non-debug logs
    toast({
      title,
      description: renderUnknownAsNode(message),
      variant,
      icon
    });
  }
  
  /**
   * Get title for the given log level
   */
  private getLevelTitle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'Debug';
      case LogLevel.INFO:
        return 'Information';
      case LogLevel.SUCCESS:
        return 'Success';
      case LogLevel.WARN:
        return 'Warning';
      case LogLevel.ERROR:
        return 'Error';
      case LogLevel.CRITICAL:
        return 'Critical Error';
      default:
        return 'Log';
    }
  }
  
  /**
   * Get variant for the given log level
   */
  private getLevelVariant(level: LogLevel): 'default' | 'destructive' | null {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return 'destructive';
      default:
        return 'default';
    }
  }
  
  /**
   * Get icon for the given log level
   */
  private getLevelIcon(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'bug';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.SUCCESS:
        return 'check-circle';
      case LogLevel.WARN:
        return 'alert-triangle';
      case LogLevel.ERROR:
        return 'alert-circle';
      case LogLevel.CRITICAL:
        return 'x-circle';
      default:
        return 'message-square';
    }
  }
  
  /**
   * Check if this transport supports the given log level & category
   */
  supports(level: LogLevel, category?: LogCategory): boolean {
    if (!this.shouldShowLevel(level)) {
      return false;
    }
    
    if (category && this.shouldSkipCategory(category)) {
      return false;
    }
    
    return true;
  }
}
