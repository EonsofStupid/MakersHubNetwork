
import { create } from 'zustand';
import { UserRole, AuthStatus } from '@/types/shared';
import { User, UserProfile } from '@/types/user';

// Define the store state and actions explicitly to avoid missing types
export interface AuthState {
  user: User | null;
  session: unknown | null;
  profile: UserProfile | null;
  roles: UserRole[];
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthActions {
  hasRole: (role: UserRole | UserRole[] | undefined) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  
  setSession: (session: unknown | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  
  initialize: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  roles: [],
  status: 'idle',
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  ...initialState,
  
  // User state management
  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
  
  // Session state management
  session: null,
  initialized: false,
  setSession: (session) => set({ session }),
  setInitialized: (initialized) => set({ initialized }),
  
  // Profile management
  profile: null,
  setProfile: (profile) => set({ profile }),
  
  // State management
  status: 'idle' as AuthStatus,
  setStatus: (status) => set({ status }),
  
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  
  // Role management
  hasRole: (role) => {
    const roles = get().roles;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return role ? roles.includes(role) : false;
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
    set({ isLoading: true });
    
    try {
      // Just set initialized for now - real implementation would check for session
      set({ initialized: true });
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error during initialization' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Profile loading
  loadUserProfile: async (userId: string) => {
    set({ isLoading: true });
    
    try {
      // Mock profile loading for now
      const profile: UserProfile = {
        id: `profile-${userId}`,
        user_id: userId,
        display_name: 'User',
        avatar_url: '',
        bio: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set({ profile });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error loading profile' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Logout
  logout: async () => {
    set({ isLoading: true });
    
    try {
      // Reset state on logout
      set({
        user: null,
        session: null,
        profile: null,
        roles: [],
        status: 'idle',
        isAuthenticated: false,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error during logout' });
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Export type to help with imports
export type AuthStore = ReturnType<typeof useAuthStore>;

// Export UserProfile type to fix import errors
export type { UserProfile };
