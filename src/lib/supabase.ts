
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

// Define a complete dummy client to use when credentials are missing
const dummyClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { subscription: { unsubscribe: () => {} } } 
    }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signIn: () => Promise.resolve({ 
      data: { session: null, user: null }, 
      error: { message: 'Dummy client - no Supabase connection' } 
    }),
    signUp: () => Promise.resolve({ 
      data: { session: null, user: null }, 
      error: { message: 'Dummy client - no Supabase connection' } 
    }),
    refreshSession: () => Promise.resolve({ 
      data: { session: null }, 
      error: { message: 'Dummy client - no Supabase connection' } 
    }),
  },
  functions: {
    invoke: (name: string, options?: any) => Promise.resolve({ 
      data: null, 
      error: { message: 'Dummy client - no Supabase connection' }
    }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Dummy client - no Supabase connection' } }),
      download: () => Promise.resolve({ data: null, error: { message: 'Dummy client - no Supabase connection' } }),
      list: () => Promise.resolve({ data: [], error: null }),
      remove: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
    getBucket: () => Promise.resolve({ data: null, error: null }),
    listBuckets: () => Promise.resolve({ data: [], error: null }),
  },
  from: (tableName: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          limit: (limit: number) => ({
            single: () => Promise.resolve({ data: null, error: null }),
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
          range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
        }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      }),
      in: (column: string, values: any[]) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      }),
      is: (column: string, value: any) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      }),
      match: (query: Record<string, any>) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      }),
      limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
    }),
    insert: (values: any) => Promise.resolve({ data: null, error: null }),
    update: (values: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (query: Record<string, any>) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (query: Record<string, any>) => Promise.resolve({ data: null, error: null }),
    }),
  }),
};

// Create Supabase client with optimized configuration if credentials exist
export const supabase = (supabaseUrl && supabaseAnonKey) ? 
  createClient(supabaseUrl, supabaseAnonKey, {
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
  }) : 
  dummyClient as any; // Cast to any to satisfy TypeScript

// Check if Supabase configuration is available and log warning if not
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
  
  return dummyClient;
}
