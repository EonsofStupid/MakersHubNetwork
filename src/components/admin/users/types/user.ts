import type { AuthUser } from '@/types/auth.types';

// Re-export the auth user type
export type { AuthUser };

// Extend AuthUser for admin-specific functionality if needed
export interface AdminUser extends AuthUser {
  // Add any admin-specific fields here
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  profile_completed: boolean;
}

export interface UserStatsItem {
  user_id: string;
  total_comments: number;
  total_posts: number;
  total_likes_received: number;
  total_parts_shared: number;
  join_date: string;
  last_active: string | null;
}

export interface ModeratorAction {
  id: string;
  user_id: string;
  moderator_id: string;
  action_type: 'warn' | 'ban' | 'unban' | 'delete_content' | 'other';
  reason: string;
  details?: string;
  created_at: string;
  expires_at?: string | null;
}
