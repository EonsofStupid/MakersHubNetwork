
import { v4 as uuid } from 'uuid';
import { LogEntry, LogFilter, LogLevel, LogCategory } from '@/shared/types/shared.types';
import { UiTransport } from './transports/ui-transport';
import { MemoryTransport } from './transports/memory-transport';

class LoggerService {
  private transports: Map<string, any> = new Map();
  private minLevel: LogLevel = LogLevel.INFO;
  private memoryTransport: MemoryTransport;

  constructor() {
    // Initialize default transports
    this.memoryTransport = new MemoryTransport({ maxEntries: 1000 });
    this.addTransport('memory', this.memoryTransport);
    this.addTransport('ui', new UiTransport());
  }

  /**
   * Add a transport to the logger
   */
  addTransport(name: string, transport: any): void {
    this.transports.set(name, transport);
    transport.setMinLevel(this.minLevel);
  }

  /**
   * Get a transport by name
   */
  getTransport(name: string): any {
    return this.transports.get(name);
  }

  /**
   * Get all transports
   */
  getTransports(): Map<string, any> {
    return this.transports;
  }

  /**
   * Set the minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
    
    // Update all transports
    this.transports.forEach(transport => {
      if (transport.setMinLevel) {
        transport.setMinLevel(level);
      }
    });
  }

  /**
   * Log a message
   */
  log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    details?: Record<string, unknown>
  ): LogEntry {
    const entry: LogEntry = {
      id: uuid(),
      level,
      category,
      message,
      timestamp: Date.now(),
      details: details || {},
    };

    // Send to all transports
    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in transport', error);
      }
    });

    return entry;
  }

  /**
   * Debug level log
   */
  debug(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  /**
   * Info level log
   */
  info(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, category, message, details);
  }

  /**
   * Warning level log
   */
  warn(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, category, message, details);
  }

  /**
   * Error level log
   */
  error(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, category, message, details);
  }

  /**
   * Critical level log
   */
  critical(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.CRITICAL, category, message, details);
  }

  /**
   * Success level log
   */
  success(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.SUCCESS, category, message, details);
  }

  /**
   * Get log entries from memory transport
   */
  getEntries(filter?: LogFilter): LogEntry[] {
    if (!this.memoryTransport) return [];
    return filter ? this.memoryTransport.getFilteredLogs(filter) : this.memoryTransport.getLogs();
  }

  /**
   * Clear all logs from memory
   */
  clearLogs(): void {
    if (this.memoryTransport && this.memoryTransport.clear) {
      this.memoryTransport.clear();
    }
  }

  /**
   * Subscribe to logs (stub - actual implementation would be elsewhere)
   */
  subscribe(callback: (entry: LogEntry) => void): () => void {
    // This is a stub - actual implementation would register callbacks
    console.log('Log subscription requested - actual implementation would register callbacks');
    return () => {};
  }
}

export const logger = new LoggerService();
export default logger;
