
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  bio?: string;
}

export type UserRole = 
  | 'user'
  | 'admin'
  | 'super_admin'
  | 'moderator'
  | 'builder'
  | 'maker'
  | 'editor'
  | 'reviewer'
  | 'guest';

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
