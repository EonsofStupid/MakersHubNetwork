
import { LogEntry, LogLevel, LogTransport } from "../types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Transport for sending logs to Supabase
 */
class SupabaseTransport implements LogTransport {
  private buffer: LogEntry[] = [];
  private maxBufferSize: number = 20;
  private minLevel: LogLevel = LogLevel.ERROR; // Only send errors and above to Supabase by default
  
  constructor(options?: { 
    maxBufferSize?: number;
    minLevel?: LogLevel;
  }) {
    if (options?.maxBufferSize) {
      this.maxBufferSize = options.maxBufferSize;
    }
    
    if (options?.minLevel !== undefined) {
      this.minLevel = options.minLevel;
    }
  }
  
  /**
   * Log an entry
   */
  log(entry: LogEntry): void {
    // Only log if the level is high enough
    if (entry.level < this.minLevel) {
      return;
    }
    
    this.buffer.push(entry);
    
    // Flush if buffer gets too large or for critical errors
    if (this.buffer.length >= this.maxBufferSize || entry.level >= LogLevel.CRITICAL) {
      this.flush().catch(err => {
        console.error('Error flushing logs to Supabase:', err);
      });
    }
  }
  
  /**
   * Flush logs to Supabase
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }
    
    const logsToSend = [...this.buffer];
    this.buffer = [];
    
    try {
      // Format logs for Supabase
      const formattedLogs = logsToSend.map(log => ({
        level: log.level,
        category: log.category,
        message: typeof log.message === 'string' ? log.message : String(log.message),
        source: log.source || null,
        details: log.details ? JSON.stringify(log.details) : null,
        user_id: log.userId || null,
        session_id: log.sessionId || null,
        created_at: log.timestamp.toISOString(),
      }));
      
      // Send to Supabase
      const { error } = await supabase
        .from('application_logs')
        .insert(formattedLogs);
      
      if (error) {
        console.error('Error sending logs to Supabase:', error);
        // If there's an error, add the logs back to the buffer for retry
        this.buffer = [...logsToSend, ...this.buffer];
        
        // Limit buffer size to prevent memory issues
        if (this.buffer.length > this.maxBufferSize * 2) {
          this.buffer = this.buffer.slice(-this.maxBufferSize * 2);
        }
      }
    } catch (error) {
      console.error('Exception sending logs to Supabase:', error);
      // If there's an exception, add the logs back to the buffer for retry
      this.buffer = [...logsToSend, ...this.buffer];
      
      // Limit buffer size to prevent memory issues
      if (this.buffer.length > this.maxBufferSize * 2) {
        this.buffer = this.buffer.slice(-this.maxBufferSize * 2);
      }
    }
  }
}

// Export singleton instance
export const supabaseTransport = new SupabaseTransport();
