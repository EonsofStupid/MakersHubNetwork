
import { createClient } from '@supabase/supabase-js';
import { getLogger } from '@/logging';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback logger in case we can't access the main logger
const fallbackLogger = {
  error: (message: string, details?: any) => console.error(message, details),
  warn: (message: string, details?: any) => console.warn(message, details),
  info: (message: string, details?: any) => console.info(message, details),
  debug: (message: string, details?: any) => console.debug(message, details),
};

// Check if Supabase configuration is available
if (!supabaseUrl || !supabaseAnonKey) {
  try {
    const logger = getLogger('supabase');
    logger.warn('Missing Supabase configuration, using dummy client', {
      details: { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseAnonKey
      }
    });
  } catch (e) {
    fallbackLogger.warn('Missing Supabase configuration, using dummy client');
  }
}

// Create Supabase client with optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: { 
      'x-application-name': 'lovable-web-app',
    },
  },
  // Removed the unsupported 'debug' option
});

// Re-export Supabase types for easier access
export type { 
  User, 
  Session,
  UserIdentity, 
  UserMetadata 
} from '@supabase/supabase-js';

// Optional fallback for testing/development without Supabase
export function createDummyClient() {
  try {
    const logger = getLogger('supabase-dummy');
    logger.warn('Creating dummy Supabase client - all operations will fail');
  } catch (e) {
    fallbackLogger.warn('Creating dummy Supabase client');
  }
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } }
      }),
      signOut: () => Promise.resolve({ error: null }),
    },
    functions: {
      invoke: (name: string) => Promise.resolve({ 
        data: null, 
        error: { message: 'Dummy client - no Supabase connection' }
      }),
    },
  };
}
