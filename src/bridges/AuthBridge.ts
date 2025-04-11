
/**
 * AuthBridge - Core authentication bridge used across the application
 * Provides a central point for authentication events and operations
 */
import { User } from '@supabase/supabase-js';
import { AuthEvent, AuthEventHandler, UserProfile } from '@/shared/types/auth.types';

// Define the AuthBridge class
export class AuthBridgeClass {
  private eventHandlers: Map<string, Set<AuthEventHandler>> = new Map();
  private user: User | null = null;
  private profile: UserProfile | null = null;
  private status: 'loading' | 'authenticated' | 'unauthenticated' = 'loading';
  
  // Auth state management
  getUserId(): string | undefined {
    return this.user?.id;
  }
  
  getUser(): User | null {
    return this.user;
  }
  
  getProfile(): UserProfile | null {
    return this.profile;
  }
  
  isAuthenticated(): boolean {
    return this.status === 'authenticated' && !!this.user;
  }
  
  // Event handling
  subscribe(channel: string, handler: AuthEventHandler): () => void {
    if (!this.eventHandlers.has(channel)) {
      this.eventHandlers.set(channel, new Set());
    }
    
    const handlers = this.eventHandlers.get(channel)!;
    handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(channel);
      }
    };
  }
  
  publish(channel: string, event: AuthEvent): void {
    const handlers = this.eventHandlers.get(channel);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }
  
  // Auth operations
  async signIn(email: string, password: string) {
    // Implementation would connect to actual auth provider
    console.log('Sign in with:', email, password);
    return null;
  }
  
  async signInWithGoogle() {
    // Implementation would connect to actual auth provider
    console.log('Sign in with Google');
    return null;
  }
  
  async signOut() {
    // Implementation would connect to actual auth provider
    console.log('Sign out');
    this.user = null;
    this.status = 'unauthenticated';
    this.publish('auth', { type: 'SIGNED_OUT' });
  }
  
  // For testing/debug
  setUser(user: User | null) {
    this.user = user;
    this.status = user ? 'authenticated' : 'unauthenticated';
    if (user) {
      this.publish('auth', { type: 'SIGNED_IN', payload: { user } });
    } else {
      this.publish('auth', { type: 'SIGNED_OUT' });
    }
  }
  
  setProfile(profile: UserProfile | null) {
    this.profile = profile;
    if (profile) {
      this.publish('auth', { 
        type: 'PROFILE_FETCHED', 
        payload: { profile } 
      });
    }
  }
}

// Create and export a singleton instance
export const authBridge = new AuthBridgeClass();

// Helper functions for event handling
export const subscribeToAuthEvents = (handler: AuthEventHandler): () => void => {
  return authBridge.subscribe('auth', handler);
};

export const publishAuthEvent = (event: AuthEvent): void => {
  authBridge.publish('auth', event);
};
