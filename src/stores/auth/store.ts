
import { create } from 'zustand';
import { AuthStore } from './types';

// Simplified auth store with no actual auth requirements
export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state - always authenticated for public site
  user: null,
  session: null,
  roles: ['viewer'], // Give everyone viewer role by default
  isLoading: false,
  error: null,
  status: 'authenticated', // Always authenticated
  initialized: true, // Always initialized
  isAuthenticated: true, // Always authenticated
  
  // Methods - simplified to do nothing
  setUser: () => {},
  setSession: () => {},
  setRoles: () => {},
  setError: () => {},
  setLoading: () => {},
  setInitialized: () => {},
  
  // Role checking - always return true
  hasRole: () => true,
  isAdmin: () => true, // Grant admin access to everyone
  
  // Initialize authentication - does nothing
  initialize: async () => {
    // No initialization needed
  },
  
  // Logout - does nothing
  logout: async () => {
    // No logout needed
  }
}));
