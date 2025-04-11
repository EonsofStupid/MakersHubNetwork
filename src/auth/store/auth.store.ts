
import { create } from 'zustand';
import { AuthState, AuthActions, UserRole } from '@/types/auth.types';
import { LogCategory } from '@/logging';
import { getLogger } from '@/logging';

export type UserProfile = {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  roles: [],
  status: 'idle',
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  ...initialState,

  // Setters
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setRoles: (roles) => set({ roles }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setStatus: (status) => set({ 
    status,
    isAuthenticated: status === 'authenticated'
  }),
  
  // Authentication methods
  hasRole: (role) => {
    const roles = get().roles;
    if (!roles || roles.length === 0) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role as UserRole);
  },
  
  isAdmin: () => {
    const roles = get().roles;
    return roles.includes('admin') || roles.includes('super_admin');
  },
  
  isSuperAdmin: () => {
    const roles = get().roles;
    return roles.includes('super_admin');
  },
  
  // Initialization
  initialize: async () => {
    const logger = getLogger();
    set({ isLoading: true });
    
    try {
      logger.info("Initializing auth store", { 
        category: LogCategory.AUTH 
      });
      
      // Implement your actual auth initialization logic here
      set({ 
        isLoading: false,
        initialized: true,
        status: 'unauthenticated'
      });
      
    } catch (error) {
      logger.error("Error initializing auth store", { 
        category: LogCategory.AUTH,
        details: error instanceof Error ? error.message : String(error)
      });
      
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error during authentication initialization",
        status: 'error'
      });
    }
  },
  
  // User profile loading
  loadUserProfile: async (userId) => {
    const logger = getLogger();
    
    if (!userId) {
      logger.warn("Cannot load user profile without user ID", {
        category: LogCategory.AUTH
      });
      return;
    }
    
    try {
      logger.info("Loading user profile", { 
        category: LogCategory.AUTH,
        details: { userId } 
      });
      
      // Implement your actual profile loading logic here
      
    } catch (error) {
      logger.error("Error loading user profile", { 
        category: LogCategory.AUTH,
        details: error instanceof Error ? error.message : String(error)
      });
      
      set({ error: error instanceof Error ? error.message : "Failed to load user profile" });
    }
  },
  
  // Logout
  logout: async () => {
    const logger = getLogger();
    
    try {
      logger.info("User logging out", {
        category: LogCategory.AUTH
      });
      
      // Implement your actual logout logic here
      
      // Reset state
      set({
        ...initialState,
        initialized: true,
        status: 'unauthenticated'
      });
      
    } catch (error) {
      logger.error("Error during logout", { 
        category: LogCategory.AUTH,
        details: error instanceof Error ? error.message : String(error)
      });
      
      set({ error: error instanceof Error ? error.message : "Failed to logout" });
    }
  }
}));

// Selectors for efficient state access
export const selectUser = (state: AuthState) => state.user;
export const selectProfile = (state: AuthState) => state.profile;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUserRoles = (state: AuthState) => state.roles;
export const selectStatus = (state: AuthState) => state.status;
export const selectError = (state: AuthState) => state.error;
export const selectIsLoading = (state: AuthState) => state.isLoading;
