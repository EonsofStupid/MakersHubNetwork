import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://vcmnomcwbmwqylwnomta.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbW5vbWN3Ym13cXlsd25vbXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNzY5NjEsImV4cCI6MjA0ODc1Mjk2MX0.Mb40Iuj_tybvZ6pVnwkopomnAsduP6zke5BZUztcLQw";

// Create a single instance of the Supabase client with explicit options
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  // Add retries for failed requests
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export utility functions that use the single client instance
export const uploadMedia = async (file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`uploads/${Date.now()}-${file.name}`, file);

    if (error) {
      console.error('Media upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    throw error;
  }
};

// Add a helper function to handle retries
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};