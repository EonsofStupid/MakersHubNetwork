
import { LogEntry, LogTransport } from '../types';
import { getLogger } from '../logger';
import { supabaseClient } from '@/lib/supabase';

interface SupabaseTransportOptions {
  tableName?: string;
  projectId?: string;
  batchSize?: number;
  includeMetadata?: boolean;
}

/**
 * Default options for the Supabase transport
 */
const defaultOptions: SupabaseTransportOptions = {
  tableName: 'application_logs',
  batchSize: 10,
  includeMetadata: true
};

/**
 * Transport for sending logs to Supabase
 */
export const supabaseTransport: LogTransport = {
  log: async (entry: LogEntry) => {
    try {
      if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return;
      }
      
      const options = { ...defaultOptions };
      
      // Prepare the log entry for Supabase
      const logData = {
        level: entry.level,
        category: entry.category,
        message: typeof entry.message === 'string' ? entry.message : JSON.stringify(entry.message),
        timestamp: new Date(),
        details: entry.details ? JSON.stringify(entry.details) : null,
        tags: entry.tags ? entry.tags.join(',') : null,
        user_id: entry.userId || entry.user_id || null,
        component: entry.component || null,
        correlation_id: entry.correlationId || null,
        source: entry.source || null
      };
      
      await supabaseClient
        .from(options.tableName || 'application_logs')
        .insert(logData);
    } catch (error) {
      console.error('Failed to send log to Supabase:', error);
    }
  }
};
