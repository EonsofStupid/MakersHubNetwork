import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from './shared.types';

/**
 * Maps Supabase User to our application's User type
 */
export function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '', // Convert undefined to empty string for our User type
    user_metadata: supabaseUser.user_metadata || {},
    app_metadata: supabaseUser.app_metadata || {},
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at,
    confirmed_at: supabaseUser.confirmed_at || null
  };
}

/**
 * Helper to extract roles from user metadata
 */
export function extractUserRoles(user: User | null): UserRole[] {
  if (!user) return [];
  
  // Check app_metadata for roles
  const appRoles = user.app_metadata?.roles as UserRole[] | undefined;
  // Fallback to user_metadata
  const userRoles = user.user_metadata?.roles as UserRole[] | undefined;
  
  // Combine roles from both sources, filter out undefined, and remove duplicates
  return Array.from(new Set([...(appRoles || []), ...(userRoles || [])]));
}

/**
 * Type guard to check if a role is a valid UserRole
 */
export function isValidUserRole(role: string): role is UserRole {
  return ['USER', 'ADMIN', 'EDITOR', 'SUPER_ADMIN', 'MODERATOR', 'BUILDER'].includes(role as UserRole);
}

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  theme_preference?: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  roles?: UserRole[];
  bio?: string;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
  location?: string;
  website?: string;
  user_id?: string;
}
