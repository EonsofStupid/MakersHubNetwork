
import { LogLevel } from './constants/log-level';
import { LogCategory, LogEntry, LogTransport } from './types';
import { v4 as uuidv4 } from 'uuid';

// Memory transport for in-memory log retention
export class MemoryTransport implements LogTransport {
  private logs: LogEntry[] = [];
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  log(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Trim logs if they exceed the max size
    if (this.logs.length > this.maxSize) {
      this.logs = this.logs.slice(this.logs.length - this.maxSize);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

// Create a singleton memory transport
export const memoryTransport = new MemoryTransport();

// Default config
const defaultConfig = {
  minLevel: LogLevel.INFO,
  transports: [memoryTransport],
  includeSource: true,
  includeUser: false,
  includeSession: false,
};

let config = { ...defaultConfig };

// Logger functions
export function initializeLogger(customConfig = {}) {
  config = { ...defaultConfig, ...customConfig };
  return config;
}

export function getLogger(source?: string) {
  const createLogMethod = (level: LogLevel) => {
    return (message: string | React.ReactNode, options: { 
      category?: LogCategory;
      details?: Record<string, unknown>;
      userId?: string;
      sessionId?: string;
      duration?: number;
      tags?: string[];
    } = {}) => {
      // Skip if level is below minimum
      if (level < config.minLevel) return;
      
      // Create log entry
      const entry: LogEntry = {
        id: uuidv4(),
        timestamp: new Date(),
        level,
        category: options.category || LogCategory.SYSTEM,
        message,
        details: options.details,
        source: config.includeSource ? source : undefined,
        userId: config.includeUser ? options.userId : undefined,
        sessionId: config.includeSession ? options.sessionId : undefined,
        duration: options.duration,
        tags: options.tags,
      };
      
      // Send to all transports
      config.transports.forEach(transport => transport.log(entry));
      
      return entry;
    };
  };
  
  return {
    trace: createLogMethod(LogLevel.TRACE),
    debug: createLogMethod(LogLevel.DEBUG),
    info: createLogMethod(LogLevel.INFO),
    warn: createLogMethod(LogLevel.WARN),
    error: createLogMethod(LogLevel.ERROR),
    critical: createLogMethod(LogLevel.CRITICAL),
  };
}
