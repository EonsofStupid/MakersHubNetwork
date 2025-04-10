
import { User, Session } from '@supabase/supabase-js';
import { LogCategory } from '@/logging';
import { getLogger } from '@/logging';
import { UserProfile } from '@/auth/store/auth.store';

// Define event types for typesafety
export type AuthEventType = 
  | 'login'
  | 'logout'
  | 'session-refresh'
  | 'user-updated'
  | 'profile-loaded'
  | 'auth-error';

export type AuthEventPayload = {
  type: AuthEventType;
  user?: User | null;
  session?: Session | null;
  profile?: UserProfile | null;
  error?: string | Error | null;
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
  
  /**
   * Initialize the Auth bridge
   */
  initialize() {
    if (this.initialized) {
      return;
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
   * Log in a user
   */
  login(email: string, password: string): Promise<{ user: User; session: Session } | { error: Error }> {
    // This would be implemented with actual auth logic
    return Promise.resolve({ error: new Error('Not implemented') });
  }
  
  /**
   * Log out the current user
   */
  logout() {
    // This would be implemented with actual auth logic
    this.publish('logout', {});
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

export function publishAuthEvent(event: AuthEventType, payload: Omit<AuthEventPayload, 'type'>) {
  AuthBridge.publish(event, payload);
}
