
import { create } from 'zustand';
import { User, UserProfile, AuthStatus } from '@/shared/types';
import { authBridge } from '@/bridges/AuthBridge';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  roles: string[];
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  
  // Helper methods
  hasRole: (role: string | string[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  roles: [],
  status: {
    isAuthenticated: false,
    isLoading: true
  },
  initialized: false,
  
  initialize: async () => {
    try {
      // Get current session
      const session = await authBridge.getCurrentSession();
      
      if (session?.user) {
        // Set user
        set({ 
          user: session.user,
          status: {
            isAuthenticated: true,
            isLoading: false
          }
        });
        
        // Extract roles from user metadata
        const userRoles = session.user.app_metadata?.roles || [];
        set({ roles: Array.isArray(userRoles) ? userRoles : [] });
        
        // Get user profile
        const profile = await authBridge.getUserProfile(session.user.id);
        if (profile) {
          set({ profile });
          
          // Update roles from profile if available
          if (profile.roles && profile.roles.length > 0) {
            set({ roles: profile.roles });
          }
        }
      } else {
        set({ 
          status: {
            isAuthenticated: false,
            isLoading: false
          }
        });
      }
      
      // Listen for auth state changes
      authBridge.subscribeToEvent('AUTH_STATE_CHANGE', (event) => {
        if (event?.type === 'SIGNED_IN') {
          // Set user and authenticated status
          set({ 
            user: event.data?.user || null,
            status: {
              isAuthenticated: true,
              isLoading: false
            }
          });
          
          // Extract roles from user metadata
          if (event.data?.user?.app_metadata?.roles) {
            const userRoles = event.data.user.app_metadata.roles;
            set({ roles: Array.isArray(userRoles) ? userRoles : [] });
          }
          
          // Get user profile
          if (event.data?.user?.id) {
            authBridge.getUserProfile(event.data.user.id)
              .then(profile => {
                if (profile) {
                  set({ profile });
                  
                  // Update roles from profile if available
                  if (profile.roles && profile.roles.length > 0) {
                    set({ roles: profile.roles });
                  }
                }
              })
              .catch(console.error);
          }
        } else if (event?.type === 'SIGNED_OUT') {
          // Reset auth state
          set({ 
            user: null,
            profile: null,
            roles: [],
            status: {
              isAuthenticated: false,
              isLoading: false
            }
          });
        }
      });
      
      set({ initialized: true });
    } catch (error) {
      console.error('Failed to initialize auth store:', error);
      set({ 
        status: {
          isAuthenticated: false,
          isLoading: false
        },
        initialized: true
      });
    }
  },
  
  signIn: async (email, password) => {
    set({ status: { ...get().status, isLoading: true } });
    
    try {
      const user = await authBridge.signIn(email, password);
      
      if (user) {
        set({ 
          user,
          status: {
            isAuthenticated: true,
            isLoading: false
          }
        });
        
        // Extract roles from user metadata
        const userRoles = user.app_metadata?.roles || [];
        set({ roles: Array.isArray(userRoles) ? userRoles : [] });
        
        // Get user profile
        const profile = await authBridge.getUserProfile(user.id);
        if (profile) {
          set({ profile });
          
          // Update roles from profile if available
          if (profile.roles && profile.roles.length > 0) {
            set({ roles: profile.roles });
          }
        }
      }
      
      return user;
    } catch (error) {
      set({ status: { ...get().status, isLoading: false } });
      throw error;
    }
  },
  
  signUp: async (email, password) => {
    set({ status: { ...get().status, isLoading: true } });
    
    try {
      const user = await authBridge.signUp(email, password);
      
      if (user) {
        set({ 
          user,
          status: {
            isAuthenticated: true,
            isLoading: false
          }
        });
        
        // Extract roles from user metadata
        const userRoles = user.app_metadata?.roles || [];
        set({ roles: Array.isArray(userRoles) ? userRoles : [] });
      }
      
      return user;
    } catch (error) {
      set({ status: { ...get().status, isLoading: false } });
      throw error;
    }
  },
  
  signInWithGoogle: async () => {
    set({ status: { ...get().status, isLoading: true } });
    
    try {
      const user = await authBridge.signInWithGoogle();
      
      if (user) {
        set({ 
          user,
          status: {
            isAuthenticated: true,
            isLoading: false
          }
        });
        
        // Extract roles from user metadata
        const userRoles = user.app_metadata?.roles || [];
        set({ roles: Array.isArray(userRoles) ? userRoles : [] });
        
        // Get user profile
        const profile = await authBridge.getUserProfile(user.id);
        if (profile) {
          set({ profile });
          
          // Update roles from profile if available
          if (profile.roles && profile.roles.length > 0) {
            set({ roles: profile.roles });
          }
        }
      }
      
      return user;
    } catch (error) {
      set({ status: { ...get().status, isLoading: false } });
      throw error;
    }
  },
  
  updateProfile: async (profileData) => {
    const { user } = get();
    if (!user) return null;
    
    try {
      const updatedProfile = await authBridge.updateUserProfile(user.id, profileData);
      if (updatedProfile) {
        set({ profile: updatedProfile });
        
        // Update roles from profile if available
        if (updatedProfile.roles && updatedProfile.roles.length > 0) {
          set({ roles: updatedProfile.roles });
        }
      }
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await authBridge.logout();
      set({
        user: null,
        profile: null,
        roles: [],
        status: {
          isAuthenticated: false,
          isLoading: false
        }
      });
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
  
  hasRole: (role) => {
    const { roles } = get();
    
    // Always check for superadmin first
    if (roles.includes('superadmin')) return true;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  },
  
  isAdmin: () => {
    return get().hasRole(['admin', 'superadmin']);
  },
  
  isSuperAdmin: () => {
    return get().hasRole('superadmin');
  }
}));
