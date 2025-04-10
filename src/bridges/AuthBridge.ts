
import { User, Session } from '@supabase/supabase-js';
import { LogCategory } from '@/logging';
import { getLogger } from '@/logging';
import { UserProfile } from '@/auth/types/shared';
import { UserRole } from '@/auth/types/shared';

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
  private listeners: Map<string, AuthEventListener[]> = new Map();
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
    
    this.initialized = true;
    return true;
  }
  
  /**
   * Subscribe to auth events
   */
  subscribe(event: AuthEventType, listener: AuthEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    const eventListeners = this.listeners.get(event)!;
    eventListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Publish an auth event
   */
  publish(event: AuthEventType, payload: Omit<AuthEventPayload, 'type'>) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const eventListeners = this.listeners.get(event)!;
    const fullPayload = { type: event, ...payload };
    
    // Use setTimeout to avoid blocking
    setTimeout(() => {
      eventListeners.forEach(listener => {
        try {
          listener(fullPayload);
        } catch (error) {
          this.logger.error(`Error in auth event listener for ${event}`, {
            category: LogCategory.AUTH,
            details: { error }
          });
        }
      });
    }, 0);
  }
  
  /**
   * Check if the current user has a specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
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
  }
  
  /**
   * Set current user
   */
  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }
  
  /**
   * Log in a user with email and password
   */
  signIn(email: string, password: string): Promise<{ user: User; session: Session } | { error: Error }> {
    // This would be implemented with actual auth logic
    // For now just publish the event
    this.publish('login', { user: null, session: null });
    return Promise.resolve({ error: new Error('Not implemented') });
  }
  
  /**
   * Sign in with Google
   */
  signInWithGoogle(): Promise<{ user: User; session: Session } | { error: Error }> {
    // This would be implemented with actual auth logic
    // For now just publish the event
    this.publish('login', { user: null, session: null });
    return Promise.resolve({ error: new Error('Not implemented') });
  }
  
  /**
   * Link a social account to an existing account
   */
  linkSocialAccount(provider: string): Promise<void> {
    // This would be implemented with actual auth logic
    return Promise.resolve();
  }
  
  /**
   * Log out the current user
   */
  logout() {
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
