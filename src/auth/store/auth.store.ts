
import { create } from 'zustand';
import { AuthState, AuthActions } from '@/types/auth.types';
import { createSessionSlice } from '@/stores/auth/slices/session.slice';
import { createUserSlice } from '@/stores/auth/slices/user.slice';
import { AuthStatus } from '@/types/shared';
import { UserProfile } from '@/types/user';

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
  
  // Add the slices
  ...createUserSlice(set, get),
  ...createSessionSlice(set, get),
  
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
    
    return roles.includes(role);
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
        avatar_url: null,
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
