import { AuthBridge } from '../bridge';
import { UserProfile, UserRole, ROLES } from '@/shared/types/shared.types';
import { RBACBridge } from '@/rbac/bridge';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Implementation of the AuthBridge interface
 */
export class AuthBridgeImpl implements AuthBridge {
  /**
   * Get current session
   */
  public async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    // This would normally come from an actual auth provider
    // For now, return a mock implementation or use the store state
    const user = useAuthStore.getState().user;
    return user ? { user } : null;
  }
  
  /**
   * Sign in with email and password
   */
  public async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Simple mock implementation for demonstration
      if (email && password) {
        // For testing: make any email with "admin" be an admin
        const isAdmin = email.includes('admin');
        const isSuperAdmin = email.includes('super');
        
        const roles: UserRole[] = ['user'];
        if (isAdmin) roles.push(ROLES.ADMIN);
        if (isSuperAdmin) roles.push(ROLES.SUPER_ADMIN);
        
        const mockUser: UserProfile = {
          id: '123',
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_metadata: {
            full_name: email.split('@')[0],
          }
        };

        // Update auth store with user
        const authStore = useAuthStore.getState();
        authStore.login(email, password);
        
        // Update RBAC store with roles
        RBACBridge.setRoles(roles);
        
        return { user: mockUser, error: null };
      }
      
      return { user: null, error: new Error('Invalid credentials') };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Sign up with email and password
   */
  public async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // For demo, implementation is similar to sign in
      if (email && password) {
        const mockUser: UserProfile = {
          id: '123',
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_metadata: {
            full_name: email.split('@')[0],
          }
        };
        
        // Update auth store with user
        const authStore = useAuthStore.getState();
        authStore.signup(email, password);
        
        // Set default role as 'user'
        RBACBridge.setRoles([ROLES.USER]);
        
        return { user: mockUser, error: null };
      }
      
      return { user: null, error: new Error('Invalid credentials') };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Sign out the current user
   */
  public async signOut(): Promise<void> {
    try {
      // Clear auth store
      const authStore = useAuthStore.getState();
      authStore.logout();
      
      // Clear RBAC store on sign out
      RBACBridge.clearRoles();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Reset password for a user
   */
  public async resetPassword(email: string): Promise<void> {
    // Placeholder implementation
    console.log(`Reset password email sent to ${email}`);
  }

  /**
   * Refresh the current session
   */
  public async refreshSession(): Promise<{ user_id: string } | null> {
    // Placeholder implementation
    const user = useAuthStore.getState().user;
    return user ? { user_id: user.id } : null;
  }

  /**
   * Get a user profile by ID
   */
  public async getUserProfile(userId?: string): Promise<UserProfile | null> {
    // Return the current user from the store if no ID is provided
    if (!userId) {
      return useAuthStore.getState().user;
    }
    
    // Otherwise, placeholder implementation
    return useAuthStore.getState().user;
  }

  /**
   * Sign in with OAuth provider
   * Implementation for GoogleLoginButton
   */
  public async signInWithOAuth(provider: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Mock implementation
      if (provider === 'google') {
        const mockUser: UserProfile = {
          id: '456',
          email: 'google.user@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_metadata: {
            full_name: 'Google User',
            avatar_url: 'https://api.dicebear.com/6.x/avataaars/svg?seed=google'
          }
        };
        
        const authStore = useAuthStore.getState();
        authStore.login('google.user@example.com', 'oauth-login');
        RBACBridge.setRoles([ROLES.USER]);
        
        return { user: mockUser, error: null };
      }
      
      return { user: null, error: new Error(`OAuth provider ${provider} not supported`) };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Link account with OAuth provider
   * Implementation for AccountLinkingModal
   */
  public async linkAccount(provider: string): Promise<boolean> {
    // Mock implementation
    console.log(`Linking account with ${provider}`);
    return true;
  }

  /**
   * Subscribe to auth events
   * Implementation for AccountLinkingModal
   */
  public onAuthEvent(callback: (event: any) => void): { unsubscribe: () => void } {
    // Mock implementation
    const mockUnsubscribe = () => {
      console.log('Unsubscribed from auth events');
    };
    
    return {
      unsubscribe: mockUnsubscribe
    };
  }
}

// Create singleton instance and export
export const authBridge = new AuthBridgeImpl();
