
import { LogEntry, LogTransport } from '../types';
import { batchify } from '../utils/batch';
import { safeDetails } from '../utils/safeDetails';

interface SupabaseTransportOptions {
  tableName: string;
  supabaseClient: any;
  batchSize?: number;
  autoFlush?: boolean;
  flushInterval?: number;
}

/**
 * Transport for sending logs to Supabase
 */
class SupabaseTransport implements LogTransport {
  private options: SupabaseTransportOptions;
  private buffer: LogEntry[] = [];
  private flushInterval: number;
  private flushIntervalId: NodeJS.Timeout | null = null;
  private flushing = false;
  
  constructor(options: SupabaseTransportOptions) {
    this.options = {
      tableName: 'logs',
      batchSize: 10,
      autoFlush: true,
      flushInterval: 5000, // 5 seconds
      ...options
    };
    
    this.flushInterval = this.options.flushInterval || 5000;
    
    // Set up automatic flush interval
    if (this.options.autoFlush) {
      this.startFlushInterval();
    }
  }
  
  log(entry: LogEntry): void {
    // Clone the entry to avoid mutations
    const entryToStore: any = { ...entry };
    
    // Ensure timestamp is a string
    if (entryToStore.timestamp) {
      // Fix timestamp handling
      entryToStore.timestamp = typeof entryToStore.timestamp === 'string' 
        ? entryToStore.timestamp 
        : (entryToStore.timestamp instanceof Date 
            ? entryToStore.timestamp.toISOString()
            : new Date().toISOString());
    }
    
    // JSON stringify any object properties for Supabase compatibility
    if (typeof entryToStore.details === 'object' && entryToStore.details !== null) {
      entryToStore.details = JSON.stringify(entryToStore.details);
    }
    
    // Add to buffer
    this.buffer.push(entryToStore);
    
    // Auto-flush if needed
    if (this.options.autoFlush && this.buffer.length >= (this.options.batchSize || 10)) {
      this.flush().catch(console.error);
    }
  }
  
  async flush(): Promise<void> {
    if (this.flushing || this.buffer.length === 0) {
      return;
    }
    
    try {
      this.flushing = true;
      
      // Get logs to send
      const logsToSend = [...this.buffer];
      this.buffer = [];
      
      // Split into batches to avoid hitting request size limits
      const batches = batchify(logsToSend, this.options.batchSize || 10);
      
      // Send each batch
      await Promise.all(batches.map(async (batch) => {
        try {
          const { error } = await this.options.supabaseClient
            .from(this.options.tableName)
            .insert(batch);
          
          if (error) {
            throw error;
          }
        } catch (err) {
          console.error('Error sending logs to Supabase:', safeDetails(err));
          
          // Put logs back in the buffer for retry
          this.buffer = [...batch, ...this.buffer];
        }
      }));
    } finally {
      this.flushing = false;
    }
  }
  
  private startFlushInterval(): void {
    this.stopFlushInterval();
    
    this.flushIntervalId = setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushInterval);
  }
  
  private stopFlushInterval(): void {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
      this.flushIntervalId = null;
    }
  }
}

// Create a type-safe batch helper function if not defined elsewhere
function createSupabaseBatchHelper() {
  return {
    batchify<T>(items: T[], batchSize: number): T[][] {
      const batches: T[][] = [];
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
      }
      return batches;
    }
  };
}

// Export the transport
export const createSupabaseTransport = (options: SupabaseTransportOptions): LogTransport => {
  return new SupabaseTransport(options);
};
