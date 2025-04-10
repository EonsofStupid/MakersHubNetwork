
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/auth/types/roles';

// Event system for auth events
export type AuthEventType = 
  'AUTH_STATE_CHANGE' | 
  'AUTH_ERROR' | 
  'AUTH_LINKING_REQUIRED' |
  'AUTH_SIGNED_IN' | 
  'AUTH_SIGNED_OUT' |
  'AUTH_PERMISSION_CHANGED';

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

// Dispatch auth events - renamed to publishAuthEvent to match imports
export const publishAuthEvent = (event: AuthEvent): void => {
  authEventHandlers.forEach(handler => handler(event));
};

// Add missing function used in App.tsx
export const initializeAuthBridge = (): void => {
  const logger = getLogger();
  logger.info('Initializing auth bridge');
  
  // Initialize auth event system
  // Any additional initialization can be added here
};

// AuthBridge singleton
export const AuthBridge = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    const logger = getLogger();
    
    try {
      logger.info('Signing in with email', { details: { email } });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      const store = useAuthStore.getState();
      store.setSession(data.session);
      
      return data;
    } catch (error) {
      logger.error('Sign in error', { details: { error } });
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
      logger.info('Signing in with Google');
      
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
      logger.error('Google sign in error', { details: { error } });
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
      logger.info('Linking social account', { details: { provider } });
      
      // For future implementation when Supabase supports account linking
      // Currently this would need to be implemented manually
      
      return true;
    } catch (error) {
      logger.error('Account linking error', { details: { error } });
      throw error;
    }
  },
  
  /**
   * Sign out
   */
  logout: async () => {
    const logger = getLogger();
    
    try {
      logger.info('Logging out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear auth store
      const store = useAuthStore.getState();
      store.setSession(null);
      
      return true;
    } catch (error) {
      logger.error('Logout error', { details: { error } });
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
    return roles.includes('admin') || roles.includes('super_admin');
  },
  
  /**
   * Check if user is super admin
   */
  isSuperAdmin: (): boolean => {
    const { roles } = useAuthStore.getState();
    return roles.includes('super_admin');
  }
};

// Setup auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();
  
  // Handle auth state change
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    store.setSession(session);
    
    if (session?.user) {
      store.loadUserProfile(session.user.id);
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
