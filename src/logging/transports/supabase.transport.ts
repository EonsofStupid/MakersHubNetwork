
import { LogEntry, LogLevel, LogTransport } from '../types';
import { getLogger } from '@/logging';

/**
 * Transport that outputs logs to Supabase
 * This is just a stub implementation that would be filled out
 * in a real application with actual Supabase connectivity
 */
class SupabaseTransport implements LogTransport {
  private buffer: LogEntry[] = [];
  private maxBufferSize = 10;
  private flushPromise: Promise<void> | null = null;
  private consoleLogger = getLogger('SupabaseTransport');
  
  /**
   * Log an entry to the Supabase buffer
   */
  public log(entry: LogEntry): void {
    // Only send higher-level logs to reduce storage costs
    if (entry.level < LogLevel.INFO) {
      return;
    }
    
    // Add to buffer
    this.buffer.push(entry);
    
    // Auto-flush when buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush().catch(error => {
        this.consoleLogger.error('Error flushing logs to Supabase:', { details: { error } });
      });
    }
  }
  
  /**
   * Flush logs to Supabase
   */
  public async flush(): Promise<void> {
    // Don't do anything if buffer is empty
    if (this.buffer.length === 0) {
      return Promise.resolve();
    }
    
    // Don't start a new flush if one is in progress
    if (this.flushPromise) {
      return this.flushPromise;
    }
    
    // Create a copy of the buffer and clear it
    const logsToFlush = [...this.buffer];
    this.buffer = [];
    
    // Store the promise so we can check if a flush is in progress
    this.flushPromise = this.sendLogsToSupabase(logsToFlush).finally(() => {
      this.flushPromise = null;
    });
    
    return this.flushPromise;
  }
  
  /**
   * Send logs to Supabase
   * This would be implemented with actual Supabase client code
   */
  private async sendLogsToSupabase(logs: LogEntry[]): Promise<void> {
    try {
      // This would be replaced with actual Supabase client code
      this.consoleLogger.debug('Would send logs to Supabase:', { details: { count: logs.length } });
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve();
    } catch (error) {
      // Put the logs back in the buffer to try again later
      this.buffer = [...logs, ...this.buffer];
      
      // Limit buffer size to prevent memory issues
      if (this.buffer.length > this.maxBufferSize * 2) {
        this.buffer = this.buffer.slice(0, this.maxBufferSize * 2);
      }
      
      return Promise.reject(error);
    }
  }
}

// Export singleton instance
export const supabaseTransport = new SupabaseTransport();
