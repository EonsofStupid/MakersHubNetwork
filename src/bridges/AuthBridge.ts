
/**
 * AuthBridge.ts
 * 
 * Bridge for the Auth module - provides a clean interface for other modules to
 * interact with the Auth module without direct dependencies.
 */

import { User, Session } from '@supabase/supabase-js';
import { createModuleBridge } from '@/core/MessageBus';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { UserProfile } from '@/types/auth.types';
import { UserRole } from '@/types/shared';

// Create a module-specific bridge
const authBridgeImpl = createModuleBridge('auth');

// Define event types for typesafety
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

export type AuthEventPayload = {
  type: AuthEventType;
  user?: User | null;
  session?: Session | null;
  profile?: UserProfile | null;
  error?: string | Error | null;
  payload?: Record<string, any>;
  [key: string]: any;
};

type AuthEventListener = (payload: AuthEventPayload) => void;

/**
 * AuthBridge implementation
 * 
 * This provides a clean interface for other modules to interact with 
 * the Auth module without direct dependencies.
 */
class AuthBridgeImpl {
  private logger = getLogger();
  private initialized: boolean = false;
  private userRoles: UserRole[] = [];
  private currentUser: User | null = null;
  
  /**
   * Initialize the Auth bridge
   */
  initialize() {
    if (this.initialized) {
      return true;
    }
    
    this.logger.info('Initializing AuthBridge', {
      category: LogCategory.AUTH,
      source: 'AuthBridge'
    });
    
    // Subscribe to auth events
    authBridgeImpl.subscribe('state', (payload: AuthEventPayload) => {
      if (payload.user) {
        this.currentUser = payload.user;
      }
      
      if (payload.type === 'AUTH_SIGNED_OUT') {
        this.currentUser = null;
        this.userRoles = [];
      }
    });
    
    this.initialized = true;
    return true;
  }
  
  /**
   * Subscribe to auth events
   */
  subscribe(event: AuthEventType, listener: AuthEventListener): () => void {
    return authBridgeImpl.subscribe(event, listener);
  }
  
  /**
   * Publish an auth event
   */
  publish(event: AuthEventType, payload: Omit<AuthEventPayload, 'type'>) {
    authBridgeImpl.publish(event, { type: event, ...payload });
  }
  
  /**
   * Check if the current user has a specific role
   */
  hasRole(role: UserRole | UserRole[] | undefined): boolean {
    if (!role) return false;
    
    if (!this.userRoles || this.userRoles.length === 0) {
      return false;
    }
    
    if (Array.isArray(role)) {
      return role.some(r => this.userRoles.includes(r));
    }
    
    return this.userRoles.includes(role);
  }
  
  /**
   * Check if the current user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole(['admin', 'super_admin']);
  }
  
  /**
   * Check if the current user is a super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
  
  /**
   * Set user roles for role checking
   */
  setRoles(roles: UserRole[]): void {
    this.userRoles = roles;
    
    // Publish role change event
    this.publish('AUTH_PERMISSION_CHANGED', { roles });
  }
  
  /**
   * Set current user
   */
  setCurrentUser(user: User | null): void {
    const hadUser = !!this.currentUser;
    const hasNewUser = !!user;
    
    this.currentUser = user;
    
    // Publish appropriate events
    if (!hadUser && hasNewUser) {
      this.publish('AUTH_SIGNED_IN', { user });
    } else if (hadUser && !hasNewUser) {
      this.publish('AUTH_SIGNED_OUT', {});
    } else if (user) {
      this.publish('AUTH_USER_UPDATED', { user });
    }
  }
  
  /**
   * Log in a user with email and password
   */
  async signIn(email: string, password: string): Promise<{ user: User; session: Session } | { error: Error }> {
    // This would be implemented with actual auth logic
    // For now just publish the event
    this.publish('login', { user: null, session: null });
    return Promise.resolve({ error: new Error('Not implemented') });
  }
  
  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<{ user: User; session: Session } | { error: Error }> {
    // This would be implemented with actual auth logic
    // For now just publish the event
    this.publish('login', { user: null, session: null });
    return Promise.resolve({ error: new Error('Not implemented') });
  }
  
  /**
   * Link a social account to an existing account
   */
  async linkSocialAccount(provider: string): Promise<void> {
    // This would be implemented with actual auth logic
    return Promise.resolve();
  }
  
  /**
   * Log out the current user
   */
  async logout() {
    // This would be implemented with actual auth logic
    this.publish('logout', {});
    return Promise.resolve();
  }
}

// Export singleton instance
export const AuthBridge = new AuthBridgeImpl();

/**
 * Initialize the Auth bridge
 */
export function initializeAuthBridge() {
  return AuthBridge.initialize();
}

/**
 * Export AuthBridge functionality
 */
export function subscribeToAuthEvents(event: AuthEventType, listener: AuthEventListener) {
  return AuthBridge.subscribe(event, listener);
}

export function publishAuthEvent(payload: AuthEventPayload) {
  AuthBridge.publish(payload.type, payload);
}

// Export the internal bridge for auth module use only
export { authBridgeImpl };
