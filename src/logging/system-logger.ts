
import { logger } from './logger.service';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

/**
 * System logger - specialized for system lifecycle events
 * Provides consistent and structured logging for all system-level operations
 */
class SystemLogger {
  /**
   * Log system startup event
   */
  static startup(details: Record<string, unknown> = {}) {
    logger.log(
      LogLevel.INFO, 
      LogCategory.SYSTEM, 
      "🚀 System starting up",
      { timestamp: Date.now(), ...details }
    );
  }
  
  /**
   * Log initialization phase
   */
  static initPhase(phase: string, progress: number, details: Record<string, unknown> = {}) {
    logger.log(
      LogLevel.INFO,
      LogCategory.SYSTEM,
      `⚡ Initialization phase: ${phase} (${progress}%)`,
      { phase, progress, timestamp: Date.now(), ...details }
    );
  }
  
  /**
   * Log system ready event
   */
  static ready(details: Record<string, unknown> = {}) {
    logger.log(
      LogLevel.SUCCESS,
      LogCategory.SYSTEM,
      "✅ System ready",
      { timestamp: Date.now(), ...details }
    );
  }
  
  /**
   * Log system critical error
   */
  static critical(message: string, error: Error | unknown, details: Record<string, unknown> = {}) {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : { message: String(error) };
      
    logger.log(
      LogLevel.CRITICAL,
      LogCategory.SYSTEM,
      `🚨 ${message}`,
      { timestamp: Date.now(), error: errorDetails, ...details }
    );
  }
  
  /**
   * Log system shutdown event
   */
  static shutdown(details: Record<string, unknown> = {}) {
    logger.log(
      LogLevel.INFO,
      LogCategory.SYSTEM,
      "🛑 System shutting down",
      { timestamp: Date.now(), ...details }
    );
  }
}

export { SystemLogger };
