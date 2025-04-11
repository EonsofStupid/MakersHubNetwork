
import { AuthBridge, AuthBridgeImplementation, AuthEvent } from '@/auth/types/bridge.types';
import { User } from '@/shared/types/user';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Event listeners for auth events
 */
const listeners: ((event: AuthEvent) => void)[] = [];

/**
 * AuthBridge implementation for handling authentication
 */
export const authBridge: AuthBridgeImplementation = {
  user: null,
  status: {
    isAuthenticated: false,
    isLoading: true,
  },

  async signIn(email: string, password: string) {
    console.log('[AuthBridge] Sign in', email);
    // Mock implementation
    const mockUser: User = {
      id: 'user-123',
      email,
      user_metadata: {
        name: 'Test User',
        avatar_url: ''
      },
      app_metadata: {
        roles: ['user']
      }
    };

    authBridge.user = mockUser;
    authBridge.status.isAuthenticated = true;
    authBridge.status.isLoading = false;

    // Publish auth event
    publishAuthEvent({ type: 'SIGNED_IN', payload: mockUser });

    return mockUser;
  },

  async signInWithGoogle() {
    console.log('[AuthBridge] Sign in with Google');
    // Mock implementation
    const mockUser: User = {
      id: 'user-123',
      email: 'google-user@example.com',
      user_metadata: {
        name: 'Google User',
        avatar_url: ''
      },
      app_metadata: {
        roles: ['user']
      }
    };

    authBridge.user = mockUser;
    authBridge.status.isAuthenticated = true;
    authBridge.status.isLoading = false;

    // Publish auth event
    publishAuthEvent({ type: 'SIGNED_IN', payload: mockUser });

    return mockUser;
  },

  async logout() {
    console.log('[AuthBridge] Logout');
    const prevUser = authBridge.user;
    authBridge.user = null;
    authBridge.status.isAuthenticated = false;

    // Publish auth event
    publishAuthEvent({ type: 'SIGNED_OUT', payload: prevUser });
    
    return true;
  },

  getUser() {
    return authBridge.user;
  },

  hasRole(role: UserRole | UserRole[]) {
    if (!authBridge.user) return false;
    
    const userRoles = authBridge.user.app_metadata?.roles || [];
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  },

  isAdmin() {
    return this.hasRole('admin') || this.hasRole('superadmin');
  },

  isSuperAdmin() {
    return this.hasRole('superadmin');
  }
};

/**
 * Subscribe to auth events
 */
export function subscribeToAuthEvents(listener: (event: AuthEvent) => void) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Publish auth event to subscribers
 */
export function publishAuthEvent(event: AuthEvent) {
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('[AuthBridge] Error in auth event listener', error);
    }
  });
}
