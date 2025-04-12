
// Auth bridge implementation
import { nanoid } from 'nanoid';
import { AuthEvent, AuthEventType, User, UserProfile, UserRole } from '@/shared/types/shared.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/shared/types/shared.types';

const logger = getLogger('AuthBridge', LogCategory.AUTH);

type AuthEventListener = (event: AuthEvent) => void;
let listeners: AuthEventListener[] = [];

/**
 * Subscribe to auth events
 */
export function subscribeToAuthEvents(listener: AuthEventListener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/**
 * Dispatch an auth event
 */
function dispatchAuthEvent(event: AuthEvent): void {
  logger.debug(`Auth event dispatched: ${event.type}`, {
    details: { event }
  });
  
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      logger.error('Error in auth event listener', {
        details: { error }
      });
    }
  });
}

/**
 * Auth Bridge Implementation
 */
export class AuthBridgeImpl {
  private mockUser: User | null = null;
  
  /**
   * Initialize the auth service
   */
  async initialize(): Promise<(() => void) | undefined> {
    logger.info('Initializing auth bridge');
    
    // For demo purposes, create a mock user
    this.mockUser = {
      id: nanoid(),
      email: 'demo@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        display_name: 'Demo User',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=demo',
      },
      app_metadata: {
        roles: ['user']
      }
    };
    
    return undefined;
  }
  
  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    logger.info('Signing in with email', { details: { email } });
    
    if (email && password) {
      // Simulate successful login
      const user = {
        id: nanoid(),
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_metadata: {
          display_name: email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        },
        app_metadata: {
          roles: ['user'] as UserRole[]
        }
      };
      
      // Store the mock user
      this.mockUser = user;
      
      // Emit auth event
      dispatchAuthEvent({
        type: AuthEventType.AUTH_SIGNIN,
        payload: { user },
        timestamp: Date.now()
      });
      
      return user;
    }
    
    if (this.mockUser) {
      const user = this.mockUser;
      const email = this.mockUser.email;
      const roles = this.mockUser.app_metadata.roles;
      
      // Emit auth event
      dispatchAuthEvent({
        type: AuthEventType.AUTH_SIGNIN,
        payload: { user, email, roles },
        timestamp: Date.now()
      });
      
      return user;
    }
    
    throw new Error('Authentication failed');
  }
  
  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    logger.info('Signing in with Google');
    
    // Simulate successful login
    const user = {
      id: nanoid(),
      email: 'google-user@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        display_name: 'Google User',
        avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=google',
      },
      app_metadata: {
        roles: ['user'] as UserRole[]
      }
    };
    
    // Store the mock user
    this.mockUser = user;
    
    // Emit auth event
    dispatchAuthEvent({
      type: AuthEventType.AUTH_SIGNIN,
      payload: { user },
      timestamp: Date.now()
    });
    
    if (this.mockUser) {
      const user = this.mockUser;
      const email = this.mockUser.email;
      const roles = this.mockUser.app_metadata.roles;
      
      // Emit auth event
      dispatchAuthEvent({
        type: AuthEventType.AUTH_SIGNIN,
        payload: { user, email, roles },
        timestamp: Date.now()
      });
      
      return user;
    }
    
    throw new Error('Authentication failed');
  }
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    logger.info('Signing out');
    
    // Clear the user
    this.mockUser = null;
    
    // Emit auth event
    dispatchAuthEvent({
      type: AuthEventType.AUTH_SIGNOUT,
      timestamp: Date.now()
    });
  }
  
  /**
   * Check if the user has a specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    if (!this.mockUser) return false;
    
    const userRoles = this.mockUser.app_metadata.roles || [];
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  }
  
  /**
   * Check if the user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole(['admin', 'super_admin']);
  }
  
  /**
   * Get the current user
   */
  getUser(): User | null {
    return this.mockUser;
  }
  
  /**
   * Update the user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    logger.info('Updating user profile', { details: { updates } });
    
    if (!this.mockUser) {
      throw new Error('No user signed in');
    }
    
    // Update the user metadata
    this.mockUser.user_metadata = {
      ...this.mockUser.user_metadata,
      bio: updates.bio || this.mockUser.user_metadata.bio,
      display_name: updates.display_name || this.mockUser.user_metadata.display_name,
      avatar_url: updates.avatar_url || this.mockUser.user_metadata.avatar_url,
      theme_preference: updates.theme_preference || this.mockUser.user_metadata.theme_preference,
      full_name: updates.full_name || this.mockUser.user_metadata.full_name,
      motion_enabled: updates.motion_enabled !== undefined ? updates.motion_enabled : this.mockUser.user_metadata.motion_enabled,
      website: updates.website || this.mockUser.user_metadata.website
    };
    
    // Emit auth event
    dispatchAuthEvent({
      type: AuthEventType.AUTH_USER_UPDATED,
      payload: { profile: this.mockUser.user_metadata },
      timestamp: Date.now()
    });
    
    return this.mockUser.user_metadata;
  }
  
  /**
   * Link a social account
   */
  async linkSocialAccount(provider: string): Promise<void> {
    logger.info('Linking social account', { details: { provider } });
    
    // For demo purposes, just emit an event
    dispatchAuthEvent({
      type: AuthEventType.AUTH_USER_UPDATED,
      payload: { linkedAccount: provider },
      timestamp: Date.now()
    });
  }
  
  /**
   * Get current auth status
   */
  getStatus() {
    return this.mockUser ? 'AUTHENTICATED' : 'UNAUTHENTICATED';
  }
}

// Create and export singleton instance
export const authBridge = new AuthBridgeImpl();
export const AuthBridge = authBridge; // To maintain compatibility with existing code

// Also create a types file for export
