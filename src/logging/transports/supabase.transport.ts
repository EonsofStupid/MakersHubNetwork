
import { LogEntry, LogTransport } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogLevel } from '../constants/log-level';

/**
 * Transport that sends logs to Supabase for persistent storage
 * Only critical, error, and important log entries are stored
 */
export const supabaseTransport: LogTransport = {
  log: async (entry: LogEntry) => {
    // Only send certain log levels to the server to avoid excessive database usage
    if (entry.level < LogLevel.ERROR && entry.category !== 'admin') {
      return;
    }
    
    try {
      // Get the current user from the auth store
      const userId = useAuthStore.getState().user?.id;
      
      // Prepare data for insertion
      const logData = {
        id: entry.id,
        timestamp: entry.timestamp,
        level: entry.level,
        level_name: entry.level.toString(),
        category: entry.category,
        message: typeof entry.message === 'string' ? entry.message : JSON.stringify(entry.message),
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
      };
      
      // Insert into the logs table
      await supabase.from('system_logs').insert(logData);
    } catch (error) {
      // If we can't send to Supabase, log to console as fallback
      // We don't use the logger here to avoid potential infinite loops
      console.error('Failed to send log to Supabase:', error);
    }
  },
  
  // Method to flush any pending logs
  flush: async () => {
    // Supabase transport is synchronous, so nothing to flush
    return Promise.resolve();
  }
};
