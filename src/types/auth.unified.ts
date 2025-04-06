
// User roles and permissions
export type UserRole = 
  | 'admin'
  | 'super_admin'
  | 'editor'
  | 'moderator'
  | 'user'
  | 'guest';

// Admin access interface
export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// User profile minimal type
export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  roles?: UserRole[];
  last_sign_in_at?: string;
  created_at?: string;
}
