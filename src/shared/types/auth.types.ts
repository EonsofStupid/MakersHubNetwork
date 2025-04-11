
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin' | 'super_admin' | 'moderator' | 'editor' | 'maker';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type Permission = 
  | 'users:read'
  | 'users:write' 
  | 'users:delete'
  | 'content:read' 
  | 'content:write' 
  | 'content:delete'
  | 'builds:read'
  | 'builds:write'
  | 'builds:delete'
  | 'builds:approve'
  | 'builds:reject'
  | 'settings:read'
  | 'settings:write'
  | 'admin:access'
  | 'admin:super'
  | 'themes:read'
  | 'themes:write'
  | 'themes:delete'
  | 'layouts:read'
  | 'layouts:write'
  | 'layouts:delete'
  | 'chats:read'
  | 'chats:write'
  | 'chats:delete'
  | 'chats:moderate';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  roles?: UserRole[];
  status?: UserStatus;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface User extends SupabaseUser {
  profile?: UserProfile;
}

export interface AuthState {
  user: User | null;
  status: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  signIn: (email: string, password: string) => Promise<null>;
  signInWithGoogle: () => Promise<null>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

export interface AuthEvent {
  type: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';
  payload?: any;
}

export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}
