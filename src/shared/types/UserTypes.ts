
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserProfile } from './shared.types';

// Type mapper function to convert Supabase User to App User
export function mapSupabaseUserToAppUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '', // Handle potential undefined
    created_at: supabaseUser.created_at || new Date().toISOString(),
    updated_at: supabaseUser.updated_at || new Date().toISOString(),
    user_metadata: supabaseUser.user_metadata || {},
    // Profile will be fetched separately
  };
}

// Define expected profile structure
export interface AppUserProfile extends UserProfile {
  // Additional fields specific to your app
}
