
import { create } from 'zustand';
import { AUTH_STATUS, UserProfile, ROLES } from '@/shared/types/shared.types';

interface AuthState {
  status: keyof typeof AUTH_STATUS;
  user: UserProfile | null;
  isAuthenticated: boolean;
  error: Error | null;
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Additional for UI state
  roles: string[];
}

// Create the auth store - always authenticated with no checks
export const useAuthStore = create<AuthState>((set) => ({
  status: AUTH_STATUS.AUTHENTICATED,
  user: {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    avatar_url: 'https://ui-avatars.com/api/?name=Demo+User',
    roles: [ROLES.USER, ROLES.ADMIN]
  },
  isAuthenticated: true,
  error: null,
  initialized: true,
  roles: [ROLES.USER, ROLES.ADMIN],
  
  // Initialize auth
  initialize: async () => {
    // Always stays authenticated
  },
  
  // Login
  login: async () => {
    // No-op, always logged in
  },
  
  // Logout
  logout: async () => {
    // No-op, always logged in
  },
  
  // Signup
  signup: async () => {
    // No-op, always logged in
  },
  
  // Reset password
  resetPassword: async () => {
    // No-op
  },
  
  // Update profile
  updateProfile: async () => {
    // No-op
  }
}));
