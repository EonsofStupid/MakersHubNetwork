
import { create } from 'zustand';
import { AUTH_STATUS, UserProfile } from '@/shared/types/shared.types';

interface AuthState {
  status: keyof typeof AUTH_STATUS;
  user: UserProfile | null;
  isAuthenticated: boolean;
  error: Error | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  
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
    avatar_url: 'https://ui-avatars.com/api/?name=Demo+User'
  },
  isAuthenticated: true,
  error: null,
  roles: ['USER', 'ADMIN'],
  
  // Initialize auth
  initialize: async () => {
    // No-op, already initialized
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
  }
}));
