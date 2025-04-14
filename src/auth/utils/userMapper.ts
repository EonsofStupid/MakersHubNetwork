
import { UserProfile } from "@/shared/types/shared.types";

/**
 * Maps raw user data from different auth providers to a standard UserProfile format
 */
export function mapUserToProfile(userData: any): UserProfile {
  // Handle null or undefined data
  if (!userData) {
    return null as unknown as UserProfile;
  }

  // Supabase auth user mapping
  if (userData.user) {
    userData = userData.user;
  }

  // Handle different user data structures based on provider
  const profile: UserProfile = {
    id: userData.id || userData.uid || '',
    email: userData.email || '',
    name: userData.name || userData.user_name || userData.displayName || userData.email?.split('@')[0] || '',
    avatar_url: userData.avatar_url || userData.avatarUrl || userData.photoURL || '',
    created_at: userData.created_at || userData.createdAt || new Date().toISOString(),
    updated_at: userData.updated_at || userData.updatedAt || new Date().toISOString(),
    last_sign_in_at: userData.last_sign_in || userData.lastSignInAt || new Date().toISOString(),
    user_metadata: userData.user_metadata || userData.userMetadata || {},
    app_metadata: userData.app_metadata || userData.appMetadata || {}
  };

  // Map roles if they are present in any metadata field
  if (userData.app_metadata?.roles) {
    profile.roles = userData.app_metadata.roles;
  } else if (userData.user_metadata?.roles) {
    profile.roles = userData.user_metadata.roles;
  }

  return profile;
}
