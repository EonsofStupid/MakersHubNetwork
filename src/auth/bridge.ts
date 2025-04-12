
// This file is a bridge that handles authentication operations
// It abstracts away the implementation details of the auth provider

import { createClient, User, Session } from '@supabase/supabase-js';
import { AuthEvent, AuthEventType, UserProfile, UserRole } from '@/shared/types/shared.types';

// Define event types
export type AuthEventHandler = (event: AuthEvent) => void;
export type AuthEventUnsubscribe = () => void;

export class AuthBridgeImpl {
  private client: ReturnType<typeof createClient>;
  private eventHandlers: AuthEventHandler[] = [];
  private session: Session | null = null;
  
  // Initialize with your Supabase client
  constructor(supabaseClient: ReturnType<typeof createClient>) {
    this.client = supabaseClient;
    
    // Set up auth state change listener
    this.client.auth.onAuthStateChange((event, session) => {
      this.session = session;
      
      this.dispatchEvent({
        type: 'AUTH_STATE_CHANGE',
        payload: { event, session }
      });
    });
  }
  
  /**
   * Dispatches an authentication event to all registered handlers
   */
  private dispatchEvent(event: AuthEvent): void {
    this.eventHandlers.forEach(handler => handler(event));
  }
  
  /**
   * Register an event handler for auth events
   * Returns a function to unsubscribe the handler
   */
  public onAuthEvent(handler: AuthEventHandler): AuthEventUnsubscribe {
    this.eventHandlers.push(handler);
    
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }
  
  /**
   * Sign in with email and password
   */
  public async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
  }
  
  /**
   * Sign in with Google OAuth
   */
  public async signInWithGoogle(): Promise<void> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google'
    });
    
    if (error) throw error;
  }
  
  /**
   * Sign up with email and password
   */
  public async signUp(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
  }
  
  /**
   * Sign out the current user
   */
  public async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }
  
  /**
   * Get the current session
   */
  public async getSession(): Promise<Session | null> {
    if (this.session) return this.session;
    
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    
    return data.session;
  }
  
  /**
   * Get the current user
   */
  public async getUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error && error.name !== 'AuthSessionMissingError') throw error;
    return data?.user || null;
  }
  
  /**
   * Check if user has a specific role
   */
  public hasRole(roles: UserRole | UserRole[]): boolean {
    // Implementation depends on how roles are stored
    // For now, we'll just return false
    return false;
  }
  
  /**
   * Link a social account to the current user
   */
  public async linkAccount(provider: string): Promise<void> {
    throw new Error('Not implemented');
  }
  
  /**
   * Check if the user is an admin
   */
  public isAdmin(): boolean {
    // Implementation would check if the user has admin role
    return false;
  }
  
  /**
   * Reset password
   */
  public async resetPassword(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
  
  /**
   * Update a user's profile information
   */
  public async updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    throw new Error('Not implemented');
  }
}

// Create and export a singleton instance
export const authBridge = new AuthBridgeImpl(
  createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_KEY || '',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: localStorage
      }
    }
  )
);
