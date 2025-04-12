
import { User, UserProfile, AuthEvent, AuthEventType } from '@/shared/types';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/logging/types';

// Define the required functions for the auth bridge
export interface AuthBridgeImplementation {
  getCurrentSession: () => Promise<{ user: User } | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
  updateUserProfile: (userId: string, profile: Partial<UserProfile>) => Promise<UserProfile | null>;
  subscribeToEvent: (eventType: AuthEventType, callback: (event?: AuthEvent) => void) => () => void;
  logout: () => Promise<void>;
  checkForPendingAccountLink: () => Promise<boolean>;
  confirmAccountLink: () => Promise<boolean>;
  cancelAccountLink: () => Promise<void>;
}

// Mock implementation for development purposes
class AuthBridgeMock implements AuthBridgeImplementation {
  private user: User | null = null;
  private profile: UserProfile | null = null;
  private subscribers: Map<string, Array<(event?: AuthEvent) => void>> = new Map();
  private logger = useLogger('AuthBridge', LogCategory.AUTH);

  constructor() {
    // Initialize with a mock user for development
    this.user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        name: 'Test User',
        avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
      },
      app_metadata: {
        roles: ['user'],
        provider: 'email'
      }
    };
    
    this.profile = {
      id: 'mock-profile-id',
      user_id: 'mock-user-id',
      display_name: 'Test User',
      full_name: 'Test User',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567',
      bio: 'This is a mock user',
      roles: ['user']
    };
    
    this.logger.info('AuthBridge initialized with mock implementation');
  }

  async getCurrentSession(): Promise<{ user: User } | null> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return this.user ? { user: this.user } : null;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    this.logger.info('Sign in attempt', { 
      details: { email } 
    });
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (email === 'admin@example.com' && password === 'password') {
      this.user = {
        id: 'mock-admin-id',
        email: 'admin@example.com',
        user_metadata: {
          name: 'Admin User',
          avatar_url: 'https://avatars.githubusercontent.com/u/9876543'
        },
        app_metadata: {
          roles: ['admin'],
          provider: 'email'
        }
      };
      
      this.profile = {
        id: 'mock-profile-admin',
        user_id: 'mock-admin-id',
        display_name: 'Admin User',
        full_name: 'Admin User',
        avatar_url: 'https://avatars.githubusercontent.com/u/9876543',
        bio: 'System administrator',
        roles: ['admin']
      };
      
      this.notifySubscribers('SIGNED_IN', { user: this.user });
      return this.user;
    }
    
    if (email && password) {
      this.user = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          name: email.split('@')[0],
          avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
        },
        app_metadata: {
          roles: ['user'],
          provider: 'email'
        }
      };
      
      this.profile = {
        id: 'mock-profile-id',
        user_id: 'mock-user-id',
        display_name: email.split('@')[0],
        full_name: email.split('@')[0],
        avatar_url: 'https://avatars.githubusercontent.com/u/1234567',
        bio: 'Regular user account',
        roles: ['user']
      };
      
      this.notifySubscribers('SIGNED_IN', { user: this.user });
      return this.user;
    }
    
    throw new Error('Invalid credentials');
  }

  async signUp(email: string, password: string): Promise<User | null> {
    this.logger.info('Sign up attempt', { 
      details: { userId: email } 
    });
    
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    this.user = {
      id: `new-user-${Date.now()}`,
      email,
      user_metadata: {
        name: email.split('@')[0],
        avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
      },
      app_metadata: {
        roles: ['user'],
        provider: 'email'
      }
    };
    
    this.profile = {
      id: `new-profile-${Date.now()}`,
      user_id: this.user.id,
      display_name: email.split('@')[0],
      full_name: email.split('@')[0],
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567',
      bio: '',
      roles: ['user']
    };
    
    this.notifySubscribers('SIGNED_IN', { user: this.user });
    return this.user;
  }

  async signInWithGoogle(): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    this.user = {
      id: 'google-user-id',
      email: 'google.user@gmail.com',
      user_metadata: {
        name: 'Google User',
        avatar_url: 'https://lh3.googleusercontent.com/a/default-user'
      },
      app_metadata: {
        roles: ['user'],
        provider: 'google'
      }
    };
    
    this.profile = {
      id: 'google-profile-id',
      user_id: 'google-user-id',
      display_name: 'Google User',
      full_name: 'Google User',
      avatar_url: 'https://lh3.googleusercontent.com/a/default-user',
      bio: '',
      roles: ['user']
    };
    
    this.notifySubscribers('SIGNED_IN', { user: this.user });
    return this.user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    if (this.profile && this.user && this.user.id === userId) {
      this.notifySubscribers('PROFILE_FETCHED', { profile: this.profile });
      return this.profile;
    }
    
    return null;
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (!this.profile || !this.user || this.user.id !== userId) {
      return null;
    }
    
    this.profile = {
      ...this.profile,
      ...profile
    };
    
    this.notifySubscribers('PROFILE_UPDATED', { profile: this.profile });
    
    // Also update user metadata if relevant fields are changed
    if (profile.full_name || profile.avatar_url) {
      this.user = {
        ...this.user,
        user_metadata: {
          ...this.user.user_metadata,
          name: profile.full_name || this.user.user_metadata?.name,
          avatar_url: profile.avatar_url || this.user.user_metadata?.avatar_url
        }
      };
      
      this.notifySubscribers('USER_UPDATED', { user: this.user });
    }
    
    return this.profile;
  }

  subscribeToEvent(eventType: AuthEventType, callback: (event?: AuthEvent) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    this.subscribers.get(eventType)!.push(callback);
    
    return () => {
      const subscribers = this.subscribers.get(eventType) || [];
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(type: AuthEventType, data?: any): void {
    const eventSubscribers = this.subscribers.get(type) || [];
    const allSubscribers = this.subscribers.get('AUTH_STATE_CHANGE') || [];
    
    const event: AuthEvent = {
      type,
      timestamp: new Date().toISOString(),
      data
    };
    
    // Notify specific event subscribers
    eventSubscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in auth event callback:', error);
      }
    });
    
    // Notify general subscribers
    allSubscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in auth event callback:', error);
      }
    });
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    this.user = null;
    this.profile = null;
    this.notifySubscribers('SIGNED_OUT');
  }

  async checkForPendingAccountLink(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    return false; // Mock implementation
  }

  async confirmAccountLink(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    return true; // Mock implementation
  }

  async cancelAccountLink(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  }
}

// Create and export a singleton instance
export const authBridge: AuthBridgeImplementation = new AuthBridgeMock();
