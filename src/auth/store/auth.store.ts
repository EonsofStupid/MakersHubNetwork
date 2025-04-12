
import { create } from 'zustand';
import { AuthStatus, User, UserProfile, UserRole } from '@/shared/types/shared.types';
import { authBridge } from '@/auth/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-category';

export interface AuthState {
  // Core auth state
  user: User | null;
  profile: UserProfile | null;
  roles: UserRole[];
  status: AuthStatus;
  error: Error | null;
  initialized: boolean;
  
  // Computed properties
  isAuthenticated: boolean;
  
  // Methods
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  refreshUser: () => Promise<User | null>;
  
  // Role checks
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const logger = useLogger('AuthStore', LogCategory.AUTH);

  return {
    // Initial state
    user: null,
    profile: null,
    roles: [],
    status: AuthStatus.INITIAL,
    error: null,
    initialized: false,
    isAuthenticated: false,
    
    // Initialize auth
    initialize: async () => {
      try {
        set({ status: AuthStatus.LOADING });
        
        // Check for existing session
        const session = authBridge.getCurrentSession();
        
        if (session?.user) {
          const user = session.user;
          const roles = user.app_metadata?.roles || ['user'];
          
          set({ 
            user,
            roles,
            status: AuthStatus.AUTHENTICATED,
            isAuthenticated: true,
            initialized: true
          });

          // Get user profile
          try {
            const profile = await authBridge.getUserProfile();
            if (profile) {
              set({ profile });
            }
          } catch (profileError) {
            logger.warn('Failed to fetch user profile during initialization', { 
              details: { error: profileError } 
            });
          }
        } else {
          set({ 
            user: null, 
            profile: null,
            roles: [],
            status: AuthStatus.UNAUTHENTICATED,
            isAuthenticated: false,
            initialized: true
          });
        }
        
        // Subscribe to auth events
        const unsubscribe = authBridge.subscribeToEvent('*', (event) => {
          if (event.type === 'AUTH_SIGNIN') {
            const user = event.payload?.user as User;
            const roles = user?.app_metadata?.roles || ['user'];
            
            set({ 
              user, 
              roles,
              status: AuthStatus.AUTHENTICATED,
              isAuthenticated: true,
              error: null
            });

            // Try to get user profile after sign in
            if (user) {
              authBridge.getUserProfile()
                .then(profile => {
                  if (profile) {
                    set({ profile });
                  }
                })
                .catch(error => {
                  logger.error('Failed to fetch profile after signin', { 
                    details: { error } 
                  });
                });
            }
          } else if (event.type === 'AUTH_SIGNOUT') {
            set({ 
              user: null, 
              profile: null,
              roles: [],
              status: AuthStatus.UNAUTHENTICATED,
              isAuthenticated: false,
              error: null
            });
          } else if (event.type === 'AUTH_ERROR') {
            set({ 
              status: AuthStatus.ERROR, 
              error: event.payload?.error as Error 
            });
            
            logger.error('Auth error', { 
              details: { error: event.payload?.error } 
            });
          }
        });
        
        // Return unsubscribe function
        return unsubscribe;
      } catch (error) {
        logger.error('Auth initialization error', { details: { error } });
        
        set({
          status: AuthStatus.ERROR,
          error: error as Error,
          isAuthenticated: false,
          initialized: true
        });
      }
    },
    
    // Sign in with email/password
    signIn: async (email, password) => {
      try {
        set({ status: AuthStatus.LOADING, error: null });
        
        const user = await authBridge.signIn(email, password);
        const roles = user.app_metadata?.roles || ['user'];
        
        set({ 
          user,
          roles,
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true 
        });
        
        // Get user profile
        try {
          const profile = await authBridge.getUserProfile();
          if (profile) {
            set({ profile });
          }
        } catch (profileError) {
          logger.warn('Failed to fetch user profile after sign in', { 
            details: { error: profileError } 
          });
        }
        
        return user;
      } catch (error) {
        logger.error('Sign in error', { details: { error } });
        set({ status: AuthStatus.ERROR, error: error as Error });
        throw error;
      }
    },
    
    // Sign up new user
    signUp: async (email, password, userData) => {
      try {
        set({ status: AuthStatus.LOADING, error: null });
        
        // Auth bridge doesn't have full signup implementation yet
        const user = await authBridge.signIn(email, password);
        
        const roles = user.app_metadata?.roles || ['user'];
        set({ 
          user,
          roles,
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true 
        });
        
        // Get user profile
        try {
          const profile = await authBridge.getUserProfile();
          if (profile) {
            set({ profile });
          }
        } catch (profileError) {
          logger.warn('Failed to fetch user profile after sign up', { 
            details: { error: profileError } 
          });
        }
        
        return user;
      } catch (error) {
        logger.error('Sign up error', { details: { error } });
        set({ status: AuthStatus.ERROR, error: error as Error });
        throw error;
      }
    },
    
    // Sign in with Google
    signInWithGoogle: async () => {
      try {
        set({ status: AuthStatus.LOADING, error: null });
        
        const user = await authBridge.signInWithGoogle();
        const roles = user.app_metadata?.roles || ['user'];
        
        set({ 
          user,
          roles,
          status: AuthStatus.AUTHENTICATED,
          isAuthenticated: true 
        });
        
        // Get user profile
        try {
          const profile = await authBridge.getUserProfile();
          if (profile) {
            set({ profile });
          }
        } catch (profileError) {
          logger.warn('Failed to fetch user profile after Google sign in', { 
            details: { error: profileError } 
          });
        }
        
        return user;
      } catch (error) {
        logger.error('Google sign in error', { details: { error } });
        set({ status: AuthStatus.ERROR, error: error as Error });
        throw error;
      }
    },
    
    // Update user
    updateUser: async (updates) => {
      try {
        const { user } = get();
        if (!user) throw new Error("No authenticated user");
        
        // This is a placeholder since actual updateUser is not implemented in bridge
        const updatedUser = { ...user, ...updates };
        
        set({ user: updatedUser });
        return updatedUser;
      } catch (error) {
        logger.error('Update user error', { details: { error } });
        set({ error: error as Error });
        throw error;
      }
    },
    
    // Update user profile
    updateUserProfile: async (updates) => {
      try {
        const { profile } = get();
        if (!profile) throw new Error("No user profile");
        
        const updatedProfile = await authBridge.updateUserProfile(updates);
        set({ profile: updatedProfile });
        
        return updatedProfile;
      } catch (error) {
        logger.error('Update profile error', { details: { error } });
        set({ error: error as Error });
        throw error;
      }
    },
    
    // Refresh user data
    refreshUser: async () => {
      try {
        const session = authBridge.getCurrentSession();
        if (!session?.user) return null;
        
        const user = session.user;
        const roles = user.app_metadata?.roles || ['user'];
        
        set({ user, roles });
        
        // Get fresh profile
        try {
          const profile = await authBridge.getUserProfile();
          if (profile) {
            set({ profile });
          }
        } catch (profileError) {
          logger.warn('Failed to fetch user profile during refresh', { 
            details: { error: profileError } 
          });
        }
        
        return user;
      } catch (error) {
        logger.error('Refresh user error', { details: { error } });
        set({ error: error as Error });
        return null;
      }
    },
    
    // Log out
    logout: async () => {
      try {
        set({ status: AuthStatus.LOADING });
        await authBridge.logout();
        
        set({
          user: null,
          profile: null,
          roles: [],
          status: AuthStatus.UNAUTHENTICATED,
          isAuthenticated: false
        });
      } catch (error) {
        logger.error('Logout error', { details: { error } });
        set({ status: AuthStatus.ERROR, error: error as Error });
        throw error;
      }
    },
    
    // Role check helpers
    isAdmin: () => {
      const { roles } = get();
      return roles.includes('admin') || roles.includes('super_admin');
    },
    
    isSuperAdmin: () => {
      const { roles } = get();
      return roles.includes('super_admin');
    },
    
    hasRole: (role) => {
      const { roles } = get();
      
      if (Array.isArray(role)) {
        return role.some(r => roles.includes(r));
      }
      
      return roles.includes(role);
    }
  };
});
