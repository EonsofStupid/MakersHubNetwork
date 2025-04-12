
import { EventEmitter } from 'events';
import { AuthEvent, AuthStatus, User, UserProfile } from '@/shared/types/shared.types';
import { UserRole } from '@/shared/types/shared.types';

// Type for auth event subscribers
type AuthEventSubscriber = (event: AuthEvent) => void;

// Auth bridge implementation
class AuthBridgeImpl {
  private subscribers: AuthEventSubscriber[] = [];
  private emitter: EventEmitter;
  
  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(20); // Increase max listeners to avoid warnings
  }
  
  // Event handling
  subscribeToAuthEvents(subscriber: AuthEventSubscriber): () => void {
    this.subscribers.push(subscriber);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    };
  }
  
  onAuthEvent(event: AuthEvent): void {
    // Notify all subscribers
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(event);
      } catch (error) {
        console.error('Error in auth event subscriber:', error);
      }
    });
    
    // Also emit through EventEmitter for legacy code
    this.emitter.emit('auth-event', event);
    this.emitter.emit(`auth-event:${event.type}`, event);
  }
  
  // Auth methods
  async getSession() {
    // Implementation will be added later with Supabase integration
    return null;
  }
  
  getUser(): User | null {
    // Implementation will be added later with Supabase integration
    return null;
  }
  
  getStatus(): AuthStatus {
    // Implementation will be added later with Supabase integration
    return AuthStatus.UNAUTHENTICATED;
  }

  isAuthenticated(): boolean {
    return this.getStatus() === AuthStatus.AUTHENTICATED;
  }
  
  async signIn(email: string, password: string): Promise<void> {
    // Implementation will be added later with Supabase integration
    console.log('Sign in with email:', email);
  }
  
  async signInWithGoogle(): Promise<void> {
    // Implementation will be added later with Supabase integration
    console.log('Sign in with Google');
  }
  
  async linkSocialAccount(provider: string): Promise<void> {
    // Implementation will be added later with Supabase integration
    console.log('Link social account:', provider);
  }
  
  async logout(): Promise<void> {
    // Implementation will be added later with Supabase integration
    console.log('Logout');
    
    this.onAuthEvent({
      type: 'AUTH_SIGNED_OUT'
    });
  }
  
  // User roles and permissions
  hasRole(role: UserRole | UserRole[]): boolean {
    // Implementation will be added later with Supabase integration
    return Array.isArray(role) ? role.includes(UserRole.USER) : role === UserRole.USER;
  }
  
  isAdmin(): boolean {
    return this.hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }
  
  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }
  
  // Profile management
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    // Implementation will be added later with Supabase integration
    console.log('Update user profile:', profileData);
    
    this.onAuthEvent({
      type: 'AUTH_PROFILE_UPDATED',
      payload: { profile: profileData }
    });
  }
}

// Export singleton instance
export const authBridge = new AuthBridgeImpl();

// Helper function to subscribe to auth events
export function subscribeToAuthEvents(subscriber: AuthEventSubscriber): () => void {
  return authBridge.subscribeToAuthEvents(subscriber);
}

// Re-export for legacy code
export { authBridge as AuthBridge };
