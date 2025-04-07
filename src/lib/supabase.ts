
import { createClient } from '@supabase/supabase-js';
import { getLogger } from '@/logging';

const logger = getLogger('Supabase');

// Get Supabase URL and key from environment or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kxeffcclfvecdvqpljbh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWZmY2NsZnZlY2R2cXBsamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjIwMTMsImV4cCI6MjA1MDk5ODAxM30.4O56xT1rUNnwrIzr3xHIHXPfa_pIMHyjQXjIoo9H4K4';

// Validate that we have the required values to create the client
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing Supabase configuration', {
    details: { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey 
    }
  });
}

// Initialize Supabase client with robust error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Log successful client initialization
logger.info('Supabase client initialized', { 
  details: { 
    url: supabaseUrl?.substring(0, 10) + '...' 
  } 
});
