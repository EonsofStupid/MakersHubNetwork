
import { UserProfile, AuthStatus, AUTH_STATUS } from '@/shared/types/shared.types';

/**
 * Auth bridge implementation
 */
class AuthBridgeClass {
  private _isAuthenticated = false;
  private _user: UserProfile | null = null;
  
  // For simplicity, we'll always return true for now (no auth checks)
  get isAuthenticated(): boolean {
    return true;
  }
  
  // Always return a mock user for now (no auth checks)
  getUser(): UserProfile | null {
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      avatar_url: 'https://ui-avatars.com/api/?name=Demo+User'
    };
  }
  
  // Mock session management
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    return { user: this.getUser()! };
  }
  
  async refreshSession(): Promise<{ user_id: string } | null> {
    return { user_id: '1' };
  }
  
  // Mock auth methods
  async signInWithEmail(): Promise<{ user: UserProfile | null; error: Error | null }> {
    return { user: this.getUser(), error: null };
  }
  
  async signUp(): Promise<{ user: UserProfile | null; error: Error | null }> {
    return { user: this.getUser(), error: null };
  }
  
  async signOut(): Promise<void> {
    // No-op
  }
  
  // Mock event subscription
  onAuthEvent(): { unsubscribe: () => void } {
    return { unsubscribe: () => {} };
  }
  
  // Mock password reset
  async resetPassword(): Promise<void> {
    // No-op
  }
  
  // Alias for getUser
  getProfile(): UserProfile | null {
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
