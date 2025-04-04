
import { createClient } from '@supabase/supabase-js';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

// Initialize Supabase client (use environment variables or fallback)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a logger for this module
const logger = getLogger('supabaseClient', { category: LogCategory.DATABASE });

let supabaseClient: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    logger.debug('Supabase client initialized');
  } else {
    logger.warn('Supabase client not initialized due to missing credentials');
  }
} catch (error) {
  logger.error('Failed to initialize Supabase client', { details: error });
}

export { supabaseClient };
