
import { createModuleBridge, MessageHandler, UnsubscribeFn } from '@/core/MessageBus';
import { UserRole } from '@/types/shared';
import { User } from '@/types/user';

// Create module-specific bridge
const authBridgeImpl = createModuleBridge('auth');

// Define auth event types
export type AuthEventType = 
  | 'login'
  | 'logout'
  | 'session-refresh'
  | 'user-updated'
  | 'profile-loaded'
  | 'auth-error'
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_STATE_CHANGE'
  | 'AUTH_ERROR'
  | 'AUTH_SESSION_REFRESHED' 
  | 'AUTH_USER_UPDATED'
  | 'AUTH_TOKEN_REFRESHED'
  | 'AUTH_PERMISSION_CHANGED'
  | 'AUTH_LINKING_REQUIRED';

/**
 * Auth event payload type
 */
export type AuthEventPayload = {
  type: AuthEventType;
  user?: User | null;
  session?: unknown | null;
  profile?: unknown | null;
  error?: string | Error | null;
  payload?: Record<string, any>;
  [key: string]: any;
};

// Extend the auth bridge implementation with auth-specific methods
const extendedAuthBridge = {
  ...authBridgeImpl,
  
  // Role checking
  hasRole: (role: UserRole | UserRole[] | undefined): boolean => {
    // Get roles from state
    const state = (window as any).__AUTH_STATE__;
    const roles = state?.roles || [];
    
    if (!role) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  },
  
  isAdmin: (): boolean => {
    return extendedAuthBridge.hasRole(['admin', 'super_admin']);
  },
  
  isSuperAdmin: (): boolean => {
    return extendedAuthBridge.hasRole('super_admin');
  },
  
  isAuthenticated: (): boolean => {
    const state = (window as any).__AUTH_STATE__;
    return !!state?.isAuthenticated;
  },
  
  // Auth operations
  signIn: async (email: string, password: string): Promise<{ user: User; session: unknown } | { error: Error }> => {
    try {
      // For now, just publish an event
      extendedAuthBridge.publish('login', { email });
      return { user: { id: 'mock-user', email } as User, session: {} };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  },
  
  signInWithGoogle: async (): Promise<{ user: User; session: unknown } | { error: Error }> => {
    try {
      extendedAuthBridge.publish('login', { provider: 'google' });
      return { user: { id: 'mock-google-user', email: 'google@example.com' } as User, session: {} };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  },
  
  linkSocialAccount: async (provider: string): Promise<void> => {
    extendedAuthBridge.publish('linking-required', { provider });
  },
  
  logout: async (): Promise<void> => {
    extendedAuthBridge.publish('logout', {});
  },
  
  setRoles: (roles: UserRole[]): void => {
    const state = (window as any).__AUTH_STATE__ || {};
    state.roles = roles;
    (window as any).__AUTH_STATE__ = state;
  },
  
  setCurrentUser: (user: User | null): void => {
    const state = (window as any).__AUTH_STATE__ || {};
    state.user = user;
    (window as any).__AUTH_STATE__ = state;
  }
};

// Create the singleton instance
class AuthBridgeClass {
  private initialized: boolean = false;
  
  initialize(): boolean {
    if (this.initialized) return true;
    
    // Initialize global state if needed
    if (!(window as any).__AUTH_STATE__) {
      (window as any).__AUTH_STATE__ = {
        user: null,
        session: null,
        roles: [],
        isAuthenticated: false
      };
    }
    
    this.initialized = true;
    return true;
  }
  
  // Proxy all methods to the extended bridge
  hasRole(role: UserRole | UserRole[] | undefined): boolean {
    return extendedAuthBridge.hasRole(role);
  }
  
  isAdmin(): boolean {
    return extendedAuthBridge.isAdmin();
  }
  
  isSuperAdmin(): boolean {
    return extendedAuthBridge.isSuperAdmin();
  }
  
  isAuthenticated(): boolean {
    return extendedAuthBridge.isAuthenticated();
  }
  
  signIn(email: string, password: string): Promise<{ user: User; session: unknown } | { error: Error }> {
    return extendedAuthBridge.signIn(email, password);
  }
  
  signInWithGoogle(): Promise<{ user: User; session: unknown } | { error: Error }> {
    return extendedAuthBridge.signInWithGoogle();
  }
  
  linkSocialAccount(provider: string): Promise<void> {
    return extendedAuthBridge.linkSocialAccount(provider);
  }
  
  logout(): Promise<void> {
    return extendedAuthBridge.logout();
  }
  
  setRoles(roles: UserRole[]): void {
    extendedAuthBridge.setRoles(roles);
  }
  
  setCurrentUser(user: User | null): void {
    extendedAuthBridge.setCurrentUser(user);
  }
  
  subscribe(event: AuthEventType | string, listener: (payload: AuthEventPayload) => void): UnsubscribeFn {
    return extendedAuthBridge.subscribe(event, listener);
  }
  
  publish(event: AuthEventType | string, payload: Omit<AuthEventPayload, 'type'>): void {
    extendedAuthBridge.publish(event, { ...payload, type: event });
  }
}

// Export singleton instance
export const AuthBridge = new AuthBridgeClass();

/**
 * Initialize the Auth bridge
 */
export function initializeAuthBridge(): boolean {
  return AuthBridge.initialize();
}

/**
 * Convenience function to subscribe to auth events
 */
export function subscribeToAuthEvents(event: AuthEventType | string, listener: (payload: AuthEventPayload) => void): UnsubscribeFn {
  return extendedAuthBridge.subscribe(event, listener);
}

/**
 * Convenience function to publish auth events
 */
export function publishAuthEvent(event: AuthEventType | string, payload: Omit<AuthEventPayload, 'type'>): void {
  extendedAuthBridge.publish(event, payload);
}

// Export the internal bridge impl for auth module use only
export { extendedAuthBridge as authBridgeImpl };
