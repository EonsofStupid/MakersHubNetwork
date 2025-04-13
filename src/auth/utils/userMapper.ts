
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserProfile } from '@/shared/types/shared.types';

/**
 * Maps a Supabase User to our application User type
 * This provides a clear boundary between external auth provider types and our app types
 */
export function mapSupabaseUserToAppUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '', // Handle potential undefined with empty string
    created_at: supabaseUser.created_at || new Date().toISOString(),
    updated_at: supabaseUser.updated_at || new Date().toISOString(),
    user_metadata: supabaseUser.user_metadata || {},
    // Profile will be fetched separately
  };
}

/**
 * Updates user app_metadata field from raw user data 
 */
export function getUserRolesFromMetadata(metadata: Record<string, any> | null): string[] {
  if (!metadata || !metadata.roles) {
    return ['user']; // Default role
  }
  
  // Ensure we always return an array of roles
  if (Array.isArray(metadata.roles)) {
    return metadata.roles;
  }
  
  // If roles is a string, convert to array
  if (typeof metadata.roles === 'string') {
    return [metadata.roles];
  }
  
  return ['user']; // Fallback
}

/**
 * Convert user profile from database to app format
 */
export function formatUserProfile(profile: any): UserProfile {
  return {
    id: profile.id,
    user_id: profile.user_id,
    username: profile.username || '',
    display_name: profile.display_name || '',
    avatar_url: profile.avatar_url || null,
    bio: profile.bio || '',
    theme_preference: profile.theme_preference || 'dark',
    motion_enabled: profile.motion_enabled !== false,
    website: profile.website || null,
    location: profile.location || null,
    roles: profile.roles || ['user'],
  };
}
