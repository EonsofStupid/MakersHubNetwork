
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole, ROLES, AuthEventType } from '@/types/shared';

// Event system for auth events
type AuthEventPayload = Record<string, any>;
type AuthEventHandler = (event: AuthEvent) => void;

interface AuthEvent {
  type: AuthEventType;
  payload?: AuthEventPayload;
}

const authEventHandlers: AuthEventHandler[] = [];

// Subscribe to auth events
export const subscribeToAuthEvents = (handler: AuthEventHandler): (() => void) => {
  authEventHandlers.push(handler);
  
  // Return unsubscribe function
  return () => {
    const index = authEventHandlers.indexOf(handler);
    if (index !== -1) {
      authEventHandlers.splice(index, 1);
    }
  };
};

// Dispatch auth events
export const publishAuthEvent = (event: AuthEvent): void => {
  authEventHandlers.forEach(handler => handler(event));
};

// Add missing function used in App.tsx
export const initializeAuthBridge = (): void => {
  const logger = getLogger();
  logger.info('Initializing auth bridge', {
    category: LogCategory.AUTH,
    source: 'AuthBridge'
  });
  
  // Initialize auth event system
  // Any additional initialization can be added here
};

// AuthBridge singleton - Central contract for auth operations
export const AuthBridge = {
  /**
   * Get current user
   */
  getUser: () => useAuthStore.getState().user,
  
  /**
   * Get user profile
   */
  getProfile: () => useAuthStore.getState().profile,
  
  /**
   * Get user roles
   */
  getRoles: () => useAuthStore.getState().roles,
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => useAuthStore.getState().isAuthenticated,
  
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    const logger = getLogger();
    
    try {
      logger.info('Signing in with email', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { email } 
      });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      const store = useAuthStore.getState();
      store.setSession(data.session);
      
      // Publish auth event
      publishAuthEvent({ 
        type: 'AUTH_SIGNED_IN',
        payload: { user: data.user }
      });
      
      return data;
    } catch (error) {
      logger.error('Sign in error', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { error } 
      });
      
      publishAuthEvent({ 
        type: 'AUTH_ERROR', 
        payload: { error, method: 'password' }
      });
      
      throw error;
    }
  },
  
  /**
   * Sign in with Google
   */
  signInWithGoogle: async () => {
    const logger = getLogger();
    
    try {
      logger.info('Signing in with Google', {
        category: LogCategory.AUTH,
        source: 'AuthBridge'
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      logger.error('Google sign in error', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { error } 
      });
      
      publishAuthEvent({ 
        type: 'AUTH_ERROR', 
        payload: { error, method: 'google' }
      });
      
      throw error;
    }
  },
  
  /**
   * Link social account
   */
  linkSocialAccount: async (provider: string) => {
    const logger = getLogger();
    
    try {
      logger.info('Linking social account', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { provider } 
      });
      
      // For future implementation when Supabase supports account linking
      // Currently this would need to be implemented manually
      
      return true;
    } catch (error) {
      logger.error('Account linking error', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { error } 
      });
      
      throw error;
    }
  },
  
  /**
   * Sign out
   */
  logout: async () => {
    const logger = getLogger();
    
    try {
      logger.info('Logging out', {
        category: LogCategory.AUTH,
        source: 'AuthBridge',
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear auth store
      const store = useAuthStore.getState();
      store.setSession(null);
      
      // Publish auth event
      publishAuthEvent({ type: 'AUTH_SIGNED_OUT' });
      
      return true;
    } catch (error) {
      logger.error('Logout error', { 
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: { error } 
      });
      
      throw error;
    }
  },
  
  /**
   * Check if user has specific role
   */
  hasRole: (role: UserRole | UserRole[]): boolean => {
    const { roles } = useAuthStore.getState();
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  },
  
  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    const { roles } = useAuthStore.getState();
    return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.SUPER_ADMIN);
  },
  
  /**
   * Check if user is super admin
   */
  isSuperAdmin: (): boolean => {
    const { roles } = useAuthStore.getState();
    return roles.includes(ROLES.SUPER_ADMIN);
  }
};

// Setup auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  const logger = getLogger();
  const store = useAuthStore.getState();
  
  logger.info('Auth state changed', { 
    category: LogCategory.AUTH,
    source: 'AuthBridge',
    details: { event }
  });
  
  // Handle auth state change
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    store.setSession(session);
    
    if (session?.user) {
      // Use setTimeout to avoid potential circular dependency issues
      setTimeout(() => {
        store.loadUserProfile(session.user.id);
      }, 0);
    }
  }
  
  if (event === 'SIGNED_OUT') {
    store.setSession(null);
  }
  
  // Dispatch to event system
  publishAuthEvent({
    type: 'AUTH_STATE_CHANGE',
    payload: { event, session }
  });
});
