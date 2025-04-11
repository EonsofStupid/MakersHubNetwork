
/**
 * Auth Bridge implementation
 * Provides a clean interface for other modules to interact with Auth module
 */

import { createModuleBridge } from '@/core/MessageBus';
import { UserRole } from '@/types/shared';
import { AuthEventType, AuthEventPayload } from '@/auth/types/bridge.types';

// Create a module-specific bridge
const authBridgeImpl = createModuleBridge('auth');

// Extend the bridge impl with typed methods
const extendedAuthBridge = {
  ...authBridgeImpl,
  
  // Authentication state
  user: null as any,
  session: null as any,
  roles: [] as UserRole[],
  
  // Authentication status checks
  hasRole: (role: UserRole | UserRole[] | undefined): boolean => {
    if (!role) return false;
    
    const roles = extendedAuthBridge.roles || [];
    
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
    return !!extendedAuthBridge.user;
  },
  
  // Authentication operations
  signIn: async (email: string, password: string): Promise<any> => {
    try {
      // Pass through to auth module via events
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Sign in timeout')), 10000);
        
        // Set up one-time listener for response
        const unsub = authBridgeImpl.subscribe('auth:signInResponse', (response) => {
          clearTimeout(timeout);
          unsub();
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
        
        // Send sign in request
        authBridgeImpl.publish('auth:signInRequest', { email, password });
      });
      
      return result;
    } catch (error) {
      return { error };
    }
  },
  
  signInWithGoogle: async (): Promise<any> => {
    try {
      // Pass through to auth module via events
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Google sign in timeout')), 30000);
        
        // Set up one-time listener for response
        const unsub = authBridgeImpl.subscribe('auth:googleSignInResponse', (response) => {
          clearTimeout(timeout);
          unsub();
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
        
        // Send sign in request
        authBridgeImpl.publish('auth:googleSignInRequest', {});
      });
      
      return result;
    } catch (error) {
      return { error };
    }
  },
  
  linkSocialAccount: async (provider: string): Promise<void> => {
    // Pass through to auth module
    authBridgeImpl.publish('auth:linkProvider', { provider });
  },
  
  logout: async (): Promise<void> => {
    // Pass through to auth module
    return authBridgeImpl.publish('auth:logoutRequest', {});
  },
  
  // State management
  setRoles: (roles: UserRole[]): void => {
    extendedAuthBridge.roles = roles;
  },
  
  setCurrentUser: (user: any): void => {
    extendedAuthBridge.user = user;
  },
  
  initialize: (): boolean => {
    // Initialize the auth bridge
    authBridgeImpl.publish('system', { type: 'init', module: 'auth' });
    return true;
  }
};

// Export the auth bridge
export const AuthBridge = extendedAuthBridge;

/**
 * Subscribe to auth events
 */
export function subscribeToAuthEvents(event: AuthEventType, listener: (payload: AuthEventPayload) => void) {
  return authBridgeImpl.subscribe(event, listener);
}

/**
 * Publish auth event
 */
export function publishAuthEvent(event: AuthEventType, payload: Omit<AuthEventPayload, 'type'>) {
  return authBridgeImpl.publish(event, { type: event, ...payload });
}

/**
 * Initialize the auth bridge
 */
export function initializeAuthBridge(): boolean {
  return AuthBridge.initialize();
}

// Export the internal bridge implementation for auth module usage
export { authBridgeImpl };
