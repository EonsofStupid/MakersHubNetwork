
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

/**
 * Initialize Supabase client with robust error handling and offline detection
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined
  }
});

// Export this client as the default to be used throughout the app
export default supabase;

/**
 * Get the current auth session safely
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    logger.error('Failed to get session', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return null;
  }
}

/**
 * Check if the user is currently online
 */
export function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Function to safely execute Supabase queries with fallbacks
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  fallback: T | null = null
): Promise<{ data: T | null; error: any }> {
  try {
    if (!isOnline()) {
      return { data: fallback, error: new Error('Offline') };
    }
    return await queryFn();
  } catch (error) {
    logger.error('Error executing Supabase query', {
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    return { data: fallback, error };
  }
}
