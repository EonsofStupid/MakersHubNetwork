
import { LogCategory, LogLevel } from './shared.types';

/**
 * Extended logger details interface for strongly typed logging
 */
export interface LogDetails {
  // Common properties
  [key: string]: unknown;
  
  // Optional typed properties that are commonly used
  moduleId?: string;
  moduleName?: string;
  path?: string;
  errorMessage?: string;
  required?: string;
  requiredPerm?: string;
  eventType?: string;
}

/**
 * Type for log entry structure used across the application
 */
export interface TypedLogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  category: LogCategory;
  details?: LogDetails;
}

/**
 * Log event type with typed entry
 */
export interface TypedLogEvent {
  entry: TypedLogEntry;
}
