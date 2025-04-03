
import { LogTransport, LogEntry, LogLevel } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';

// Style templates for console logs
const CONSOLE_STYLES = {
  [LogLevel.TRACE]: 'color: #9CA3AF',
  [LogLevel.DEBUG]: 'color: #6B7280',
  [LogLevel.INFO]: 'color: #3B82F6',
  [LogLevel.WARN]: 'color: #F59E0B; font-weight: bold',
  [LogLevel.ERROR]: 'color: #EF4444; font-weight: bold',
  [LogLevel.CRITICAL]: 'color: #B91C1C; font-weight: bold; background: #FECACA; padding: 2px 4px; border-radius: 2px',
  [LogLevel.SUCCESS]: 'color: #10B981; font-weight: bold'
};

/**
 * Console transport for logging
 */
export const consoleTransport: LogTransport = {
  log(entry: LogEntry): void {
    try {
      // Format the log for console
      const timestamp = new Date(entry.timestamp).toISOString().slice(11, -1); // HH:MM:SS
      const levelName = LOG_LEVEL_NAMES[entry.level];
      const categoryTag = entry.category ? `[${entry.category}]` : '';
      const sourceTag = entry.source ? `[${entry.source}]` : '';
      
      const logStyle = CONSOLE_STYLES[entry.level] || '';
      const categoryStyle = 'color: #6366F1; font-weight: bold';
      const sourceStyle = 'color: #8B5CF6';
      const timestampStyle = 'color: #6B7280';
      
      // Select the appropriate console method based on log level
      let consoleMethod: 'log' | 'info' | 'warn' | 'error' | 'debug' = 'log';
      switch (entry.level) {
        case LogLevel.DEBUG:
        case LogLevel.TRACE:
          consoleMethod = 'debug';
          break;
        case LogLevel.INFO:
        case LogLevel.SUCCESS:
          consoleMethod = 'info';
          break;
        case LogLevel.WARN:
          consoleMethod = 'warn';
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          consoleMethod = 'error';
          break;
      }
      
      // Output to console with styling
      if (typeof window !== 'undefined' && window.console && window.console[consoleMethod]) {
        // In browser - use styled logs
        console[consoleMethod](
          `%c${levelName}%c${categoryTag} %c${sourceTag} %c${timestamp}:%c ${entry.message}`,
          logStyle,
          categoryStyle,
          sourceStyle,
          timestampStyle,
          'color: inherit'
        );
        
        // Log details as a separate object if present
        if (entry.details && Object.keys(entry.details).length > 0) {
          console[consoleMethod === 'log' ? 'dir' : consoleMethod](entry.details);
        }
      } else {
        // Node.js or non-standard console - use plain text
        console[consoleMethod](
          `${levelName} ${categoryTag} ${sourceTag} ${timestamp}: ${entry.message}`,
          entry.details || ''
        );
      }
    } catch (error) {
      // Fallback if fancy console logging fails
      console.error('Console transport error:', error);
      console.error('Original log entry:', entry);
    }
  }
};
