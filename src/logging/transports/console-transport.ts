
import { LogEntry, LogTransport } from '../types';

/**
 * Console transport for logging
 */
export const consoleTransport: LogTransport = {
  id: 'console',
  name: 'Console',
  enabled: true,
  
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.category}]`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'info':
        console.info(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'warn':
        console.warn(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'error':
        console.error(`${prefix} ${entry.message}`, entry.details || '');
        break;
      case 'critical':
        console.error(`${prefix} CRITICAL: ${entry.message}`, entry.details || '');
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
