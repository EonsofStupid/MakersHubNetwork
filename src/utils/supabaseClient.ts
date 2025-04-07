
import { supabase as defaultClient } from '@/lib/supabase';

/**
 * Get the single Supabase client instance
 * This is a wrapper to ensure we're using a consistent client across the app
 */
export function getSupabaseClient() {
  return defaultClient;
}

/**
 * Utility for getting the current auth session
 */
export async function getSession() {
  try {
    const { data, error } = await defaultClient.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

// Export the default client for compatibility with existing code
export const supabase = defaultClient;
