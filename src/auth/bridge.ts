
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/shared/types/shared.types';

// Type for authentication status
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// Type for user profile
export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  theme_preference: string | null;
  motion_enabled: boolean | null;
}

// Supabase authentication client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Auth event types
export type AuthEventType = 'AUTH_SIGNED_IN' | 'AUTH_SIGNED_OUT' | 'AUTH_USER_UPDATED' | 'AUTH_SESSION_DELETED';

// Auth Bridge implementation
export class AuthBridgeImpl {
  // Methods for authentication
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }
  
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) throw error;
    return data;
  }
  
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data as UserProfile;
  }
  
  async updateProfile(profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id!)
      .select()
      .single();
      
    if (error) throw error;
    return data as UserProfile;
  }
  
  getStatus(): { status: 'AUTHENTICATED' | 'UNAUTHENTICATED' } {
    const session = supabase.auth.getSession();
    return {
      status: session ? 'AUTHENTICATED' : 'UNAUTHENTICATED'
    };
  }
  
  isAuthenticated() {
    return Boolean(supabase.auth.getSession());
  }
  
  isAdmin() {
    // This would need to check roles from the auth store or supabase session
    return false;
  }
  
  isSuperAdmin() {
    // This would need to check roles from the auth store or supabase session
    return false;
  }
  
  subscribeToEvent(event: AuthEventType, callback: () => void) {
    // Implementation would use supabase.auth.onAuthStateChange
    return { unsubscribe: () => {} };
  }
}

// Export a singleton instance of AuthBridge
export const authBridge = new AuthBridgeImpl();
