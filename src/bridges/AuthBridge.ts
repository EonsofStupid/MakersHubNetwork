
import { User, UserProfile, UserRole } from '@/shared/types/shared.types';

// Define auth event types
export type AuthEventType = 
  | 'AUTH_STATE_CHANGED'
  | 'AUTH_USER_CHANGED'
  | 'AUTH_PROFILE_CHANGED' 
  | 'AUTH_PERMISSION_CHANGED';

export type AuthEvent = {
  type: AuthEventType;
  payload?: any;
};

export type AuthEventHandler = (event: AuthEvent) => void;

// Auth bridge implementation interface
export interface AuthBridgeImplementation {
  getUser: () => User | null;
  getProfile: () => UserProfile | null;
  getUserRoles: () => UserRole[];
  signIn: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<UserProfile | null>;
  subscribeToAuthEvents: (handler: AuthEventHandler) => () => void;
  publishAuthEvent: (event: AuthEvent) => void;
}

// Create a simple implementation
class AuthBridgeClass implements AuthBridgeImplementation {
  private user: User | null = null;
  private profile: UserProfile | null = null;
  private roles: UserRole[] = [];
  private eventHandlers: AuthEventHandler[] = [];

  constructor() {
    // Initialize with demo user for development if needed
    if (import.meta.env.DEV && import.meta.env.VITE_USE_DEMO_USER === 'true') {
      this.user = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {
          name: 'Demo User',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
        },
        app_metadata: {
          roles: ['admin']
        }
      };
      
      this.profile = {
        id: 'demo-profile-id',
        user_id: this.user.id,
        display_name: 'Demo User',
        avatar_url: this.user.user_metadata?.avatar_url,
        roles: ['admin'],
      };
      
      this.roles = ['admin'];
    }
  }

  getUser() {
    return this.user;
  }
  
  getProfile() {
    return this.profile;
  }
  
  getUserRoles() {
    return this.roles;
  }

  async signIn(email: string, password: string) {
    console.log('AuthBridge: signIn called', { email, password });
    // Mock implementation
    this.user = {
      id: 'user-123',
      email,
      user_metadata: {
        name: email.split('@')[0],
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=custom'
      },
      app_metadata: {
        roles: ['user']
      }
    };
    
    this.profile = {
      id: 'profile-123',
      user_id: this.user.id,
      display_name: email.split('@')[0],
      avatar_url: this.user.user_metadata?.avatar_url,
    };
    
    this.roles = ['user'];
    
    // Publish auth state changed event
    this.publishAuthEvent({ type: 'AUTH_STATE_CHANGED', payload: { user: this.user } });
    return this.user;
  }

  async signInWithGoogle() {
    console.log('AuthBridge: signInWithGoogle called');
    
    // Mock implementation
    this.user = {
      id: 'google-user-123',
      email: 'google-user@example.com',
      user_metadata: {
        name: 'Google User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
      },
      app_metadata: {
        roles: ['user']
      }
    };
    
    this.profile = {
      id: 'google-profile-123',
      user_id: this.user.id,
      display_name: 'Google User',
      avatar_url: this.user.user_metadata?.avatar_url,
    };
    
    this.roles = ['user'];
    
    // Publish auth state changed event
    this.publishAuthEvent({ type: 'AUTH_STATE_CHANGED', payload: { user: this.user } });
    return this.user;
  }

  async signOut() {
    console.log('AuthBridge: signOut called');
    
    // Clear user data
    this.user = null;
    this.profile = null;
    this.roles = [];
    
    // Publish auth state changed event
    this.publishAuthEvent({ type: 'AUTH_STATE_CHANGED', payload: { user: null } });
    return;
  }
  
  async updateProfile(profileData: Partial<UserProfile>) {
    console.log('AuthBridge: updateProfile called', profileData);
    
    if (!this.user || !this.profile) {
      console.error('Cannot update profile: No user is signed in');
      return null;
    }
    
    // Update profile with new data
    this.profile = {
      ...this.profile,
      ...profileData,
      updated_at: new Date().toISOString()
    };
    
    // Publish profile changed event
    this.publishAuthEvent({ 
      type: 'AUTH_PROFILE_CHANGED', 
      payload: { profile: this.profile } 
    });
    
    return this.profile;
  }

  subscribeToAuthEvents(handler: AuthEventHandler) {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }

  publishAuthEvent(event: AuthEvent) {
    this.eventHandlers.forEach(handler => handler(event));
  }
}

// Create singleton instance
export const authBridge: AuthBridgeImplementation = new AuthBridgeClass();

// Export event subscription and publishing functions
export const subscribeToAuthEvents = (handler: AuthEventHandler) => {
  return authBridge.subscribeToAuthEvents(handler);
};

export const publishAuthEvent = (event: AuthEvent) => {
  authBridge.publishAuthEvent(event);
};
