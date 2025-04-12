
import { create } from 'zustand';
import { UserRole, AuthStatus } from '@/shared/types/shared.types';
import { authBridge } from '@/auth/bridge';

// Re-export UserProfile type
export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  theme_preference: string | null;
  motion_enabled: boolean | null;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  roles: UserRole[];
  error: Error | null;
  initialized: boolean;
  isAuthenticated: boolean;
  
  // Methods
  initialize: () => Promise<void>;
  refreshSession: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  loadUserRoles: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Helpers
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  status: AuthStatus.LOADING,
  roles: [],
  error: null,
  initialized: false,
  isAuthenticated: false,
  
  initialize: async () => {
    try {
      set({ status: AuthStatus.LOADING });
      
      const session = await authBridge.getCurrentSession();
      
      if (session) {
        set({ 
          user: session.user,
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true
        });
        
        // Load user profile
        await get().loadUserProfile();
        
        // Load user roles
        await get().loadUserRoles();
      } else {
        set({ 
          user: null,
          profile: null,
          status: AuthStatus.UNAUTHENTICATED,
          isAuthenticated: false,
          roles: []
        });
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = authBridge.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            set({ 
              user: session.user, 
              status: AuthStatus.AUTHENTICATED,
              isAuthenticated: true
            });
            
            // Load user profile and roles
            await get().loadUserProfile();
            await get().loadUserRoles();
          } else if (event === 'SIGNED_OUT') {
            set({ 
              user: null, 
              profile: null,
              status: AuthStatus.UNAUTHENTICATED,
              isAuthenticated: false,
              roles: []
            });
          } else if (event === 'USER_UPDATED' && session) {
            set({ user: session.user });
            await get().loadUserProfile();
          }
        }
      );
      
      // Mark initialization as complete
      set({ initialized: true });
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Failed to initialize auth'),
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false,
        initialized: true
      });
    }
  },
  
  refreshSession: async () => {
    try {
      set({ status: AuthStatus.LOADING });
      
      const session = await authBridge.getCurrentSession();
      
      if (session) {
        set({ 
          user: session.user, 
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true 
        });
        
        // Load user profile and roles
        await get().loadUserProfile();
        await get().loadUserRoles();
      } else {
        set({ 
          user: null, 
          profile: null,
          status: AuthStatus.UNAUTHENTICATED,
          isAuthenticated: false,
          roles: [] 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Failed to refresh session'),
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false 
      });
    }
  },
  
  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const profile = await authBridge.getUserProfile(user.id);
      set({ profile });
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Don't set error state here, as profile might be optional
    }
  },
  
  loadUserRoles: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      // This is a mock implementation. In a real app, you'd fetch roles from your database
      // based on the user ID or claims from the session
      const mockRoles: UserRole[] = [UserRole.USER];
      
      // Check if the user's email contains "admin" to mock admin roles
      if (user.email?.includes('admin')) {
        mockRoles.push(UserRole.ADMIN);
      }
      
      // Check if the user's email contains "super" to mock superadmin roles
      if (user.email?.includes('super')) {
        mockRoles.push(UserRole.SUPERADMIN);
      }
      
      set({ roles: mockRoles });
    } catch (error) {
      console.error('Failed to load user roles:', error);
      set({ roles: [UserRole.USER] }); // Default to basic user role
    }
  },
  
  signInWithEmail: async (email, password) => {
    try {
      set({ status: AuthStatus.LOADING });
      
      await authBridge.signInWithEmail(email, password);
      
      // Session state will be updated via the onAuthStateChange listener
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Failed to sign in'),
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  
  signInWithGoogle: async () => {
    try {
      set({ status: AuthStatus.LOADING });
      
      await authBridge.signInWithOAuth('google');
      
      // Session state will be updated via the onAuthStateChange listener
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Failed to sign in with Google'),
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false 
      });
      throw error;
    }
  },
  
  signUp: async (email, password) => {
    try {
      set({ status: AuthStatus.LOADING });
      
      await authBridge.signUp(email, password);
      
      const session = await authBridge.getCurrentSession();
      
      if (session) {
        set({ 
          user: session.user, 
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true 
        });
        
        // Load user profile
        await get().loadUserProfile();
        
        // Load user roles
        await get().loadUserRoles();
      } else {
        set({ 
          user: null, 
          status: AuthStatus.UNAUTHENTICATED,
          isAuthenticated: false,
          error: new Error('Signup successful but requires email verification before login') 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Failed to sign up'),
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await authBridge.signOut();
      
      // Session state will be updated via the onAuthStateChange listener
      
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to log out') });
      throw error;
    }
  },
  
  updateUserProfile: async (profileData) => {
    try {
      const { user, profile } = get();
      if (!user || !profile) throw new Error('User not authenticated');
      
      // Update profile with new data
      const updatedProfile = await authBridge.updateUserProfile({
        ...profileData,
        id: user.id
      });
      
      set({ profile: updatedProfile });
      return updatedProfile;
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to update profile') });
      throw error;
    }
  },
  
  hasRole: (roleOrRoles) => {
    const { roles } = get();
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(role => roles.includes(role));
    }
    return roles.includes(roleOrRoles);
  },
  
  isAdmin: () => {
    const { roles } = get();
    return roles.includes(UserRole.ADMIN) || roles.includes(UserRole.SUPERADMIN);
  },
  
  isSuperAdmin: () => {
    const { roles } = get();
    return roles.includes(UserRole.SUPERADMIN);
  }
}));
