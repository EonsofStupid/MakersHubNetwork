
import { LogEntry, LogTransport } from '../types';

/**
 * Console transport for logging with enhanced theme error visibility
 */
export const consoleTransport: LogTransport = {
  id: 'console',
  name: 'Console',
  enabled: true,
  
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.category}]`;
    
    // Special handling for theme-related errors - make them stand out
    const isThemeRelated = entry.category?.toString().toLowerCase().includes('theme') || 
                          (typeof entry.message === 'string' && entry.message.toLowerCase().includes('theme'));
    
    // Special handling for critical theme errors
    if (isThemeRelated && (entry.level === 'error' || entry.level === 'critical')) {
      console.error(`%c${prefix} ${entry.message}`, 'background: #ff2d6e; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;', entry.details || '');
      
      // Log details separately for better visibility
      if (entry.details && typeof entry.details === 'object') {
        console.error('%cTheme Error Details:', 'color: #ff2d6e; font-weight: bold;', entry.details);
      }
      return;
    }
    
    // Special handling for theme warnings
    if (isThemeRelated && entry.level === 'warn') {
      console.warn(`%c${prefix} ${entry.message}`, 'background: #ff9e2d; color: black; padding: 2px 4px; border-radius: 2px; font-weight: bold;', entry.details || '');
      return;
    }
    
    // Normal logging for other messages
    switch (entry.level) {
      case 'debug':
        console.debug(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'info':
        if (isThemeRelated) {
          console.info(`%c${prefix} ${entry.message}`, 'color: #00F0FF; font-weight: bold;', entry.details || '');
        } else {
          console.info(`${prefix} ${entry.message}`, entry.details || '');
        }
        break;
      case 'warn':
        console.warn(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'error':
        console.error(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'critical':
        console.error(`%c${prefix} CRITICAL: ${entry.message}`, 'background: #FF2D6E; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;', entry.details || '');
        break;
      default:
        console.log(`${prefix} ${entry.message}`, entry.details || '');
    }
  },
  
  getLogs(): LogEntry[] {
    return []; // Console doesn't store logs, so this returns an empty array
  },
  
  subscribe(): () => void {
    // Console transport doesn't support subscriptions
    return () => {}; // Return unsubscribe function
  },
  
  clear(): void {
    console.clear();
  }
};

export default consoleTransport;
