
import { LogEntry, LogTransport } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogLevel } from '../constants/log-level';
import { nodeToSearchableString } from '@/shared/utils/react-utils';

/**
 * Transport that sends logs to Supabase for persistent storage
 * Only critical, error, and important log entries are stored
 */
class SupabaseTransport implements LogTransport {
  private queue: LogEntry[] = [];
  private isSending = false;
  private maxRetries = 3;
  
  log(entry: LogEntry): void {
    // Only send certain log levels to the server to avoid excessive database usage
    if (entry.level < LogLevel.ERROR && entry.category !== 'admin') {
      return;
    }
    
    // Add to queue to handle in batch
    this.queue.push(entry);
    
    // Try to send if not already sending
    if (!this.isSending) {
      this.processSendQueue().catch(err => {
        console.error('Failed to send logs to Supabase:', err);
      });
    }
  }
  
  private async processSendQueue(retryCount = 0): Promise<void> {
    if (this.queue.length === 0 || this.isSending) {
      return;
    }
    
    this.isSending = true;
    
    try {
      // Get the current user from the auth store
      const userId = useAuthStore.getState().user?.id;
      
      // Take up to 10 items from the queue
      const batch = this.queue.slice(0, 10);
      
      // Prepare entries for insertion
      const logData = batch.map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        level: entry.level,
        level_name: LOG_LEVEL_NAMES[entry.level] || 'UNKNOWN',
        category: entry.category,
        message: nodeToSearchableString(entry.message),
        source: entry.source || null,
        details: entry.details ? JSON.stringify(entry.details) : null,
        user_id: userId || entry.userId || null,
        session_id: entry.sessionId || null,
        tags: entry.tags || null,
        client_info: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
          screenSize: `${window.innerWidth}x${window.innerHeight}`
        }
      }));
      
      // Insert into the logs table
      const { error } = await supabase.from('system_logs').insert(logData);
      
      if (error) {
        throw error;
      }
      
      // Remove processed entries from queue
      this.queue = this.queue.slice(batch.length);
      
      // If more entries in queue, process them
      if (this.queue.length > 0) {
        await this.processSendQueue();
      }
    } catch (error) {
      // Retry with exponential backoff if not exceeded max retries
      if (retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          this.processSendQueue(retryCount + 1).catch(err => {
            console.error('Failed to retry sending logs to Supabase:', err);
          });
        }, delay);
      } else {
        // If we can't send to Supabase after retries, log to console as fallback
        console.error('Failed to send logs to Supabase after retries:', error);
        
        // Clear the queue to prevent backlog
        this.queue = [];
      }
    } finally {
      this.isSending = false;
    }
  }
  
  // Method to flush any pending logs
  async flush(): Promise<void> {
    if (this.queue.length > 0) {
      await this.processSendQueue();
    }
    return Promise.resolve();
  }
}

// Import here to avoid circular dependency
import { LOG_LEVEL_NAMES } from '../constants/log-level';

// Export singleton instance
export const supabaseTransport = new SupabaseTransport();
