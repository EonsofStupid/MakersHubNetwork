
import { AuthBridge } from '../bridge';
import { UserProfile, UserRole } from '@/shared/types/SharedTypes';
import { RBACBridge } from '@/rbac/bridge';

/**
 * Implementation of the AuthBridge interface
 */
export class AuthBridgeImpl implements AuthBridge {
  /**
   * Get current session
   */
  public async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    // This would normally come from an actual auth provider
    // For now, return a mock implementation
    return null;
  }
  
  /**
   * Sign in with email and password
   */
  public async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    // Simple mock implementation for demonstration
    if (email && password) {
      // For testing: make any email with "admin" be an admin
      const isAdmin = email.includes('admin');
      const isSuperAdmin = email.includes('super');
      
      const roles: UserRole[] = ['user'];
      if (isAdmin) roles.push('admin');
      if (isSuperAdmin) roles.push('superadmin');
      
      const mockUser: UserProfile = {
        id: '123',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_metadata: {
          full_name: email.split('@')[0],
        }
      };
      
      // Update RBAC store with roles
      RBACBridge.setRoles(roles);
      
      return { user: mockUser, error: null };
    }
    
    return { user: null, error: new Error('Invalid credentials') };
  }

  /**
   * Sign up with email and password
   */
  public async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
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
      
      // Set default role as 'user'
      RBACBridge.setRoles(['user']);
      
      return { user: mockUser, error: null };
    }
    
    return { user: null, error: new Error('Invalid credentials') };
  }

  /**
   * Sign out the current user
   */
  public async signOut(): Promise<void> {
    // Clear RBAC store on sign out
    RBACBridge.clearRoles();
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
    return null;
  }

  /**
   * Get a user profile by ID
   */
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Placeholder implementation
    return null;
  }
}
