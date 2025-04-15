
import { UserProfile, AuthStatus, AUTH_STATUS, UserRole, ROLES } from '@/shared/types/shared.types';

/**
 * Auth bridge implementation
 */
class AuthBridgeClass {
  private _isAuthenticated = false;
  private _user: UserProfile | null = null;
  
  // For simplicity, we'll return true (no auth checks)
  get isAuthenticated(): boolean {
    return true;
  }
  
  // Return a mock user with roles
  getUser(): UserProfile | null {
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      avatar_url: 'https://ui-avatars.com/api/?name=Demo+User',
      roles: [ROLES.USER],
      user_metadata: {
        full_name: 'Demo User',
        avatar_url: 'https://ui-avatars.com/api/?name=Demo+User'
      }
    };
  }
  
  // Mock session management
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    return { user: this.getUser()! };
  }
  
  async refreshSession(): Promise<{ user_id: string } | null> {
    return { user_id: '1' };
  }
  
  // Mock auth methods with proper signatures
  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    return { user: this.getUser(), error: null };
  }
  
  async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    return { user: this.getUser(), error: null };
  }
  
  async signOut(): Promise<void> {
    // No-op
  }
  
  // Mock event subscription
  onAuthEvent(callback: (event: any) => void): { unsubscribe: () => void } {
    return { unsubscribe: () => {} };
  }
  
  // Mock password reset
  async resetPassword(email: string): Promise<void> {
    // No-op
  }
  
  // Alias for getUser
  getProfile(): UserProfile | null {
    return this.getUser();
  }

  // Get user profile by ID (used in auth store)
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getUser();
  }
  
  // Status getter
  getStatus(): AuthStatus {
    return AUTH_STATUS.AUTHENTICATED;
  }
  
  // Error getter
  getError(): Error | null {
    return null;
  }
  
  // Status flags
  get isLoading(): boolean {
    return false;
  }
  
  get isInitialized(): boolean {
    return true;
  }
}

export const authBridge = new AuthBridgeClass();
