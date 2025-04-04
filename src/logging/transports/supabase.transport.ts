
import { LogTransport, LogEntry, LogLevel, LogCategory } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface BatchOptions {
  maxSize: number;
  interval: number;
}

/**
 * Supabase transport for logging to Supabase
 * Batch-sends logs to improve performance
 */
export class SupabaseTransport implements LogTransport {
  private queue: LogEntry[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private options: BatchOptions;
  private isFlushingNow = false;
  
  constructor(options?: Partial<BatchOptions>) {
    this.options = {
      maxSize: options?.maxSize || 10,
      interval: options?.interval || 5000 // 5 seconds
    };
  }
  
  log(entry: LogEntry): void {
    // Add to queue
    this.queue.push(entry);
    
    // If we've reached the max size, flush immediately
    if (this.queue.length >= this.options.maxSize) {
      this.flush();
      return;
    }
    
    // Otherwise, set a timeout to flush
    if (!this.timeout) {
      this.timeout = setTimeout(() => this.flush(), this.options.interval);
    }
  }
  
  async flush(): Promise<void> {
    // If we're already flushing or there's nothing to flush, return
    if (this.isFlushingNow || this.queue.length === 0) {
      return;
    }
    
    // Clear the timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    this.isFlushingNow = true;
    
    // Take the current queue and reset it
    const logsToSend = [...this.queue];
    this.queue = [];
    
    try {
      // Format logs for Supabase
      const formattedLogs = logsToSend.map(log => this.formatLogForSupabase(log));
      
      // Send logs in batches to avoid hitting size limits
      const batchSize = 25;
      for (let i = 0; i < formattedLogs.length; i += batchSize) {
        const batch = formattedLogs.slice(i, i + batchSize);
        
        // Send to Supabase
        await this.sendToSupabase(batch);
      }
    } catch (error) {
      console.error('Error sending logs to Supabase:', error);
      
      // Put the logs back in the queue
      this.queue = [...logsToSend, ...this.queue];
    } finally {
      this.isFlushingNow = false;
      
      // If there are more logs, set a timeout to flush them
      if (this.queue.length > 0 && !this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.options.interval);
      }
    }
  }
  
  /**
   * Format a log entry for Supabase
   */
  private formatLogForSupabase(log: LogEntry): {
    level: number;
    category: string;
    message: string;
    details: Record<string, any>;
    timestamp: string;
    source: string;
  } {
    // Format the log for Supabase
    return {
      level: log.level,
      category: log.category || 'general', // Provide default category
      message: String(log.message), // Ensure message is a string
      details: log.details || {},
      timestamp: typeof log.timestamp === 'string' ? log.timestamp : log.timestamp.toISOString(),
      source: log.source || 'app'
    };
  }
  
  /**
   * Send logs to Supabase
   */
  private async sendToSupabase(logs: any[]): Promise<void> {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    
    try {
      // Convert logs to the format expected by Supabase
      const dbLogs = logs.map(log => ({
        level: log.level,
        category: log.category,
        message: log.message,
        details: log.details as Json,
        timestamp: log.timestamp,
        source: log.source
      }));
      
      // Insert the logs
      const { error } = await supabase.from('application_logs').insert(dbLogs);
      
      if (error) {
        throw new Error(`Supabase log insert error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error sending logs to Supabase:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const supabaseTransport = new SupabaseTransport();
