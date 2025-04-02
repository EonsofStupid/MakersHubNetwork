
import { LogEntry, LogLevel, LogTransport } from '../types';
import { getLogger } from '@/logging';
import { supabase } from '@/integrations/supabase/client';

/**
 * Transport that outputs logs to Supabase
 * This implementation handles actual Supabase connectivity with resilient
 * error handling and reconnection logic
 */
class SupabaseTransport implements LogTransport {
  private buffer: LogEntry[] = [];
  private maxBufferSize = 10;
  private flushPromise: Promise<void> | null = null;
  private consoleLogger = getLogger('SupabaseTransport');
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // ms
  private isConnected = true;
  
  constructor() {
    this.setupConnectionMonitoring();
  }
  
  private setupConnectionMonitoring() {
    // Add basic connectivity monitoring
    window.addEventListener('online', () => {
      this.isConnected = true;
      this.consoleLogger.info('Network connection restored, flushing log buffer');
      this.flush().catch(error => {
        this.consoleLogger.error('Error flushing logs after reconnection:', { details: { error } });
      });
    });
    
    window.addEventListener('offline', () => {
      this.isConnected = false;
      this.consoleLogger.warn('Network connection lost, logs will be buffered');
    });
  }
  
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
    
    // Auto-flush when buffer is full or immediately if connected and critical log
    if (this.buffer.length >= this.maxBufferSize || 
        (this.isConnected && entry.level >= LogLevel.ERROR)) {
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
      this.retryCount = 0; // Reset retry count on successful flush
    });
    
    return this.flushPromise;
  }
  
  /**
   * Send logs to Supabase with retry logic
   */
  private async sendLogsToSupabase(logs: LogEntry[]): Promise<void> {
    if (!this.isConnected) {
      // If offline, put logs back in buffer and resolve
      this.buffer = [...logs, ...this.buffer];
      return Promise.resolve();
    }
    
    try {
      // Actual implementation with Supabase
      const { error } = await supabase
        .from('application_logs')
        .insert(logs.map(log => ({
          level: log.level,
          category: log.category,
          message: log.message,
          details: log.details,
          timestamp: log.timestamp,
          source: 'frontend'
        })));
      
      if (error) {
        throw error;
      }
      
      this.consoleLogger.debug('Successfully sent logs to Supabase', { details: { count: logs.length } });
      return Promise.resolve();
    } catch (error) {
      this.consoleLogger.warn('Failed to send logs to Supabase', { details: { error, retryCount: this.retryCount } });
      
      // Implement retry logic with backoff
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);
        
        this.consoleLogger.debug(`Retrying in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Put the logs back in the buffer and try again
            this.buffer = [...logs, ...this.buffer];
            // Limit buffer size to prevent memory issues
            if (this.buffer.length > this.maxBufferSize * 2) {
              this.buffer = this.buffer.slice(0, this.maxBufferSize * 2);
            }
            this.flush().then(resolve).catch(() => resolve());
          }, delay);
        });
      }
      
      // If we've exhausted retries, put the logs back in the buffer to try again later
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
