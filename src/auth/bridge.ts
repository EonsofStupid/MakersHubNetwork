
// Import necessary dependencies
import { supabase } from '@/lib/supabase';
import { User, UserRole, AuthStatus } from '@/shared/types/shared.types';

// Type definitions for auth events and subscribers
export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';
export type AuthEventCallback = (event: any) => void;
export type AuthEventSubscriber = { id: string; callback: AuthEventCallback };

class AuthBridgeImpl {
  private subscribers: AuthEventSubscriber[] = [];
  private nextSubscriberId = 1;

  // Get current auth status
  getStatus(): { status: AuthStatus } {
    if (this.isLoading()) {
      return { status: AuthStatus.LOADING };
    }
    
    if (this.isAuthenticated()) {
      return { status: AuthStatus.AUTHENTICATED };
    }
    
    return { status: AuthStatus.UNAUTHENTICATED };
  }

  // Check if auth is loading
  isLoading(): boolean {
    return supabase.auth.session === undefined;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!supabase.auth.session();
  }

  // Get current user session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(profile: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign in with OAuth provider
  async signInWithOAuth(provider: 'google' | 'github') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with OAuth:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Subscribe to auth events
  subscribeToAuthEvents(callback: AuthEventCallback): () => void {
    const id = `sub_${this.nextSubscriberId++}`;
    this.subscribers.push({ id, callback });
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub.id !== id);
    };
  }

  // Check user role
  hasRole(role: UserRole | UserRole[]): boolean {
    const user = supabase.auth.user();
    if (!user) return false;
    
    const userRoles = user.app_metadata?.roles || [];
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }

  // Check if user is super admin
  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }
}

// Export singleton instance
export const authBridge = new AuthBridgeImpl();
