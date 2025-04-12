
import { AuthBridge, AuthState } from "./types/auth.bridge";
import { User, UserProfile, UserRole, AuthStatus, AuthEvent, AuthEventType } from "@/shared/types/shared.types";
import { mapSupabaseUserToAppUser } from "@/shared/types/user.types";
import { supabase } from "@/lib/supabase";

class AuthBridgeImpl implements AuthBridge {
  private listeners: ((event: AuthEvent) => void)[] = [];
  private currentUser: User | null = null;
  private currentRoles: UserRole[] = [];
  
  // Subscribe to auth events
  subscribeToAuthEvents(callback: (event: AuthEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Get current session
  async getCurrentSession(): Promise<any | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Map the Supabase user to our app user type
      this.currentUser = mapSupabaseUserToAppUser(session.user);
      
      // Notify listeners
      this.notifyListeners({
        type: AuthEventType.AUTH_STATE_CHANGE,
        user: this.currentUser
      });
    }
    
    return session;
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  }

  // Sign in with email
  async signInWithEmail(email: string, password: string): Promise<{ 
    user: User | null; 
    session: any | null; 
    error: Error | null 
  }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { user: null, session: null, error };
    }
    
    this.currentUser = mapSupabaseUserToAppUser(data.user);
    
    // Update roles from metadata
    this.currentRoles = (data.user?.app_metadata?.roles || ['user']) as UserRole[];
    
    // Notify listeners
    this.notifyListeners({
      type: AuthEventType.SIGNED_IN,
      user: this.currentUser
    });
    
    return { 
      user: this.currentUser, 
      session: data.session, 
      error: null 
    };
  }

  // Sign in with OAuth provider
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook'): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  // Sign up with email
  async signUp(email: string, password: string): Promise<{ 
    user: User | null; 
    session: any | null; 
    error: Error | null 
  }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      return { user: null, session: null, error };
    }
    
    this.currentUser = mapSupabaseUserToAppUser(data.user);
    
    // New users get basic role
    this.currentRoles = [UserRole.USER];
    
    // Notify listeners
    this.notifyListeners({
      type: AuthEventType.SIGNED_IN,
      user: this.currentUser
    });
    
    return { 
      user: this.currentUser, 
      session: data.session, 
      error: null 
    };
  }

  // Sign out
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    
    this.currentUser = null;
    this.currentRoles = [];
    
    // Notify listeners
    this.notifyListeners({
      type: AuthEventType.SIGNED_OUT,
      user: null
    });
  }

  // Update user profile
  async updateUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();
      
    if (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
    
    // Notify listeners
    this.notifyListeners({
      type: AuthEventType.USER_UPDATED,
      user: this.currentUser
    });
    
    return data as UserProfile;
  }

  // Update password
  async updatePassword(password: string): Promise<void> {
    await supabase.auth.updateUser({ password });
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    await supabase.auth.resetPasswordForEmail(email);
  }

  // Has role
  hasRole(role: UserRole | UserRole[]): boolean {
    // Super admin has all roles
    if (this.currentRoles.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }
    
    if (Array.isArray(role)) {
      return role.some(r => this.currentRoles.includes(r));
    }
    
    return this.currentRoles.includes(role);
  }

  // Is admin
  isAdmin(): boolean {
    return this.hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }

  // Is super admin
  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  // Link account
  async linkAccount(provider: string): Promise<void> {
    // This would need to be implemented based on your auth provider
    console.log(`Linking ${provider} account`);
  }

  // Unlink account
  async unlinkAccount(provider: string): Promise<void> {
    // This would need to be implemented based on your auth provider
    console.log(`Unlinking ${provider} account`);
  }

  // Get linked accounts
  async getLinkedAccounts(): Promise<string[]> {
    // This would need to be implemented based on your auth provider
    return [];
  }

  // Private method to notify all listeners
  private notifyListeners(event: AuthEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in auth event listener:', error);
      }
    });
  }
}

export const authBridge = new AuthBridgeImpl();
