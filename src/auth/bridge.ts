
import { useAuthStore } from './store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/auth/types/auth.types';
import { CircuitBreaker } from '@/utils/circuitBreaker';

// Define the event types
export type AuthEventType = 
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_STATE_CHANGED'
  | 'AUTH_SESSION_REFRESH'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_ROLES_UPDATED'
  | 'AUTH_PERMISSION_CHANGED'
  | 'AUTH_SOCIAL_LOGIN_STARTED'
  | 'AUTH_SOCIAL_LOGIN_SUCCESS'
  | 'AUTH_SOCIAL_LOGIN_ERROR'
  | 'AUTH_ACCOUNT_LINKED'
  | 'AUTH_LINKING_REQUIRED';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

type AuthEventHandler = (event: AuthEvent) => void;

// Create a simple event system
const eventHandlers: AuthEventHandler[] = [];

// Create a circuit breaker to prevent infinite loops
const authCircuitBreaker = new CircuitBreaker('auth-bridge', 5, 5000);

/**
 * Subscribe to auth events
 * @param handler The handler function to call when an event occurs
 * @returns Unsubscribe function
 */
export function subscribeToAuthEvents(handler: AuthEventHandler): () => void {
  eventHandlers.push(handler);
  
  return () => {
    const index = eventHandlers.indexOf(handler);
    if (index !== -1) {
      eventHandlers.splice(index, 1);
    }
  };
}

/**
 * Publish an auth event
 * @param event The event to publish
 */
export function publishAuthEvent(event: AuthEvent): void {
  const logger = getLogger();
  
  // Check if the circuit breaker is open to prevent excessive events
  if (authCircuitBreaker.isOpen) {
    logger.warn(`Auth event publishing stopped by circuit breaker: ${event.type}`, {
      category: LogCategory.AUTH,
      source: 'auth/bridge',
    });
    return;
  }
  
  // Log the event
  logger.debug(`Auth event published: ${event.type}`, {
    category: LogCategory.AUTH,
    source: 'auth/bridge',
    details: event
  });
  
  // Loop through all handlers and call them with the event
  eventHandlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      // Record failure on circuit breaker
      authCircuitBreaker.recordFailure();
      
      logger.error('Error in auth event handler', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error, eventType: event.type }
      });
    }
  });
  
  // Record successful publishing
  authCircuitBreaker.recordSuccess();
}

/**
 * Export auth methods that will be available through AuthBridge
 * This provides a centralized API for authentication
 */
export const AuthBridge = {
  // Authentication methods
  signIn: async (email: string, password: string) => {
    const logger = getLogger();
    logger.info('AuthBridge: signIn attempt', {
      category: LogCategory.AUTH,
      source: 'auth/bridge',
      details: { email }
    });
    
    // In a real app, use supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      logger.error('AuthBridge: signIn error', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error }
      });
      throw error;
    }
    
    if (!data.user || !data.session) {
      const err = new Error('Authentication failed - no user or session returned');
      logger.error('AuthBridge: signIn failed', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error: err }
      });
      throw err;
    }
    
    // Update the auth store directly
    const store = useAuthStore.getState();
    store.setUser(data.user);
    store.setSession(data.session);
    
    // Determine roles - for now we'll use any roles in app_metadata
    // or assign default viewer role if none exist
    let roles: UserRole[] = ['viewer']; 
    
    if (data.user.app_metadata?.roles && Array.isArray(data.user.app_metadata.roles)) {
      roles = [...roles, ...data.user.app_metadata.roles];
    }
    
    store.setRoles(roles);
    
    // Publish auth event
    publishAuthEvent({
      type: 'AUTH_SIGNED_IN',
      payload: { user: data.user, session: data.session, roles }
    });
    
    return data.user;
  },
  
  // Social provider login with styled popup
  signInWithSocialProvider: async (provider: Provider) => {
    const logger = getLogger();
    logger.info(`AuthBridge: social sign-in attempt with ${provider}`, {
      category: LogCategory.AUTH,
      source: 'auth/bridge'
    });
    
    publishAuthEvent({
      type: 'AUTH_SOCIAL_LOGIN_STARTED',
      payload: { provider }
    });
    
    try {
      // Use Supabase OAuth signin with popup
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // Using popup mode for the WMPULSE styled experience
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          },
          skipBrowserRedirect: false, // Will still redirect in a popup
        }
      });
      
      if (error) {
        logger.error(`AuthBridge: ${provider} sign-in error`, {
          category: LogCategory.AUTH,
          source: 'auth/bridge',
          details: { error }
        });
        
        publishAuthEvent({
          type: 'AUTH_SOCIAL_LOGIN_ERROR',
          payload: { provider, error }
        });
        
        throw error;
      }
      
      // Provider auth is async - user will be redirected
      // But we still return the URL data
      logger.info(`AuthBridge: ${provider} sign-in redirect initiated`, {
        category: LogCategory.AUTH,
        source: 'auth/bridge'
      });
      
      return data;
    } catch (error) {
      logger.error(`AuthBridge: ${provider} sign-in failed`, {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error }
      });
      
      publishAuthEvent({
        type: 'AUTH_SOCIAL_LOGIN_ERROR',
        payload: { provider, error }
      });
      
      throw error;
    }
  },
  
  // Specifically for Google login
  signInWithGoogle: async () => {
    return AuthBridge.signInWithSocialProvider('google');
  },
  
  // Link a social account to an existing account
  linkSocialAccount: async (provider: Provider) => {
    const logger = getLogger();
    const user = useAuthStore.getState().user;
    
    if (!user) {
      const err = new Error('Cannot link account - user not logged in');
      logger.error('AuthBridge: linkSocialAccount failed', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error: err }
      });
      throw err;
    }
    
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider
      });
      
      if (error) {
        logger.error(`AuthBridge: ${provider} linking error`, {
          category: LogCategory.AUTH,
          source: 'auth/bridge',
          details: { error }
        });
        throw error;
      }
      
      logger.info(`AuthBridge: ${provider} account linked successfully`, {
        category: LogCategory.AUTH,
        source: 'auth/bridge'
      });
      
      publishAuthEvent({
        type: 'AUTH_ACCOUNT_LINKED',
        payload: { provider, user: data }
      });
      
      return data;
    } catch (error) {
      logger.error(`AuthBridge: ${provider} linking failed`, {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error }
      });
      throw error;
    }
  },
  
  logout: async () => {
    const logger = getLogger();
    logger.info('AuthBridge: logout', {
      category: LogCategory.AUTH,
      source: 'auth/bridge'
    });
    
    // In a real app, use supabase auth
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('AuthBridge: logout error', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error }
      });
      throw error;
    }
    
    // Update store directly
    await useAuthStore.getState().logout();
    
    // Publish auth event
    publishAuthEvent({
      type: 'AUTH_SIGNED_OUT'
    });
  },
  
  // Read-only getter methods
  getUser: () => {
    return useAuthStore.getState().user;
  },
  
  getSession: () => {
    return useAuthStore.getState().session;
  },
  
  getProfile: () => {
    return useAuthStore.getState().profile;
  },
  
  getRoles: () => {
    return useAuthStore.getState().roles;
  },
  
  getStatus: () => {
    return useAuthStore.getState().status;
  },
  
  // Role checking methods
  hasRole: (role: UserRole | UserRole[]) => {
    return useAuthStore.getState().hasRole(role);
  },
  
  isAdmin: () => {
    return useAuthStore.getState().isAdmin();
  },
  
  isSuperAdmin: () => {
    return useAuthStore.getState().roles.includes('super_admin');
  },
  
  // Add method to check debug access
  hasDebugAccess: () => {
    return useAuthStore.getState().roles.includes('super_admin');
  },
  
  // Check authentication status
  isAuthenticated: () => {
    return useAuthStore.getState().isAuthenticated;
  }
};

/**
 * Initialize auth bridge by subscribing to auth store changes
 * and broadcasting events
 */
export function initializeAuthBridge(): void {
  const logger = getLogger();
  logger.info('Initializing auth bridge', {
    category: LogCategory.AUTH,
    source: 'auth/bridge'
  });
  
  // Subscribe to supabase auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      logger.info('Auth state changed from Supabase', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { event }
      });
      
      const store = useAuthStore.getState();
      
      if (event === 'SIGNED_IN' && session) {
        store.setSession(session);
        
        // Assign role if needed
        if (store.roles.length === 0) {
          store.setRoles(['viewer']);
        }
        
        publishAuthEvent({
          type: 'AUTH_SIGNED_IN',
          payload: { user: session.user, session }
        });
      } else if (event === 'SIGNED_OUT') {
        store.setUser(null);
        store.setSession(null);
        store.setRoles([]);
        
        publishAuthEvent({
          type: 'AUTH_SIGNED_OUT'
        });
      } else if (event === 'USER_UPDATED' && session) {
        store.setUser(session.user);
        
        publishAuthEvent({
          type: 'AUTH_USER_UPDATED',
          payload: { user: session.user }
        });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        store.setSession(session);
        
        publishAuthEvent({
          type: 'AUTH_SESSION_REFRESH',
          payload: { session }
        });
      }
    }
  );
  
  // Check for stored user on startup
  const checkForExistingSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      // Update the store with the session
      const store = useAuthStore.getState();
      store.setSession(data.session);
      
      // Load user profile
      if (data.session.user) {
        store.loadUserProfile(data.session.user.id);
      }
    }
  };
  
  // Use setTimeout to avoid initialization cycles
  setTimeout(checkForExistingSession, 0);
  
  // Use a timestamp to track the last update we processed
  // This helps prevent event loops
  let lastUpdateProcessed = Date.now();
  
  // Subscribe to auth store changes to broadcast events
  const unsubscribe = useAuthStore.subscribe((state) => {
    // Skip if this update is too close to the last one we processed
    if (state.lastUpdated <= lastUpdateProcessed) {
      return;
    }
    
    // Update our timestamp
    lastUpdateProcessed = state.lastUpdated;
    
    // Publish state changed event
    publishAuthEvent({
      type: 'AUTH_STATE_CHANGED',
      payload: { status: state.status }
    });
  });
  
  // Clean up on window unload
  window.addEventListener('beforeunload', () => {
    subscription?.unsubscribe();
    unsubscribe();
  });
  
  logger.info('Auth bridge initialized', {
    category: LogCategory.AUTH,
    source: 'auth/bridge'
  });
}

// Check for account linking opportunity and prompt the user
export async function checkAccountLinkingOpportunities(user: User): Promise<boolean> {
  if (!user) return false;

  const logger = getLogger();
  const hasPasswordAuth = user.app_metadata?.provider === 'email';
  
  // Check if there could be opportunities for linking with social providers
  // This is a simplified check - in a real app, you might want to check against known email domains
  if (hasPasswordAuth) {
    logger.info('User could potentially link social accounts', {
      category: LogCategory.AUTH,
      source: 'auth/bridge'
    });

    // Publish event that could be used by UI to prompt user
    publishAuthEvent({
      type: 'AUTH_LINKING_REQUIRED',
      payload: { user }
    });
    
    return true;
  }
  
  return false;
}
