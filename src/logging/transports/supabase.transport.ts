
import { LogEntry, LogTransport } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { safeDetails } from '../utils/safeDetails';

/**
 * Configuration for the Supabase transport
 */
interface SupabaseTransportConfig {
  /** Table name in Supabase */
  tableName: string;
  
  /** Whether to include the stack trace for error logs */
  includeStackTraces?: boolean;
  
  /** Maximum retry attempts */
  maxRetries?: number;
  
  /** Batch size for flushing logs */
  batchSize?: number;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: SupabaseTransportConfig = {
  tableName: 'logs',
  includeStackTraces: true,
  maxRetries: 3,
  batchSize: 20
};

/**
 * SupabaseTransport to send logs to Supabase database
 */
class SupabaseTransport implements LogTransport {
  private config: SupabaseTransportConfig;
  private buffer: LogEntry[] = [];
  private flushPromise: Promise<void> | null = null;
  
  constructor(config: Partial<SupabaseTransportConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Log entry to Supabase
   */
  log(entry: LogEntry): void {
    try {
      this.buffer.push(this.prepareEntry(entry));
      
      if (this.buffer.length >= (this.config.batchSize || 1)) {
        this.flush().catch(console.error);
      }
    } catch (error) {
      console.error('Error logging to Supabase:', error);
    }
  }
  
  /**
   * Prepare entry for storage in Supabase
   */
  private prepareEntry(entry: LogEntry): LogEntry {
    const preparedEntry = { ...entry };
    
    // Convert timestamps to ISO string if needed
    if (entry.timestamp && typeof entry.timestamp !== 'string') {
      if ((entry.timestamp as Date).toISOString) {
        preparedEntry.timestamp = (entry.timestamp as Date).toISOString();
      }
    }
    
    // Stringify objects in details
    if (entry.details && typeof entry.details === 'object') {
      try {
        preparedEntry.details = JSON.stringify(entry.details);
      } catch (e) {
        preparedEntry.details = safeDetails(entry.details);
      }
    }
    
    return preparedEntry;
  }
  
  /**
   * Flush logs to Supabase
   */
  async flush(): Promise<void> {
    // If already flushing, wait for current flush to complete
    if (this.flushPromise) {
      return this.flushPromise;
    }
    
    // Nothing to flush
    if (this.buffer.length === 0) {
      return Promise.resolve();
    }
    
    const entriesToFlush = [...this.buffer];
    this.buffer = [];
    
    this.flushPromise = this.sendToSupabase(entriesToFlush);
    
    try {
      await this.flushPromise;
    } finally {
      this.flushPromise = null;
    }
  }
  
  /**
   * Send logs to Supabase with retry logic
   */
  private async sendToSupabase(entries: LogEntry[], attempt = 0): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.config.tableName)
        .insert(entries);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error sending logs to Supabase:', error);
      
      // Retry logic
      if (attempt < (this.config.maxRetries || 0)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        return this.sendToSupabase(entries, attempt + 1);
      }
      
      // Maximum retries reached, re-add to buffer if possible
      if (this.buffer.length + entries.length <= (this.config.batchSize || 20) * 2) {
        this.buffer = [...entries, ...this.buffer];
      }
    }
  }
}

// Create and export a singleton instance
export const supabaseTransport = new SupabaseTransport();
