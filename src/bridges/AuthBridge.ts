
import { UserProfile } from '@/shared/types/shared.types';

/**
 * AuthBridge implementation
 * Centralizes authentication functionality
 */
class AuthBridgeImpl {
  // Session management
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        return { user: JSON.parse(storedUser) };
      }
      return null;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  async refreshSession(): Promise<{ user_id: string } | null> {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return { user_id: user.id };
      }
      return null;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }

  // Authentication methods
  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Mock implementation
      const user: UserProfile = {
        id: '123',
        email,
        name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'demo_token');
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Mock implementation
      const user: UserProfile = {
        id: '123',
        email,
        name: 'New User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'demo_token');
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_roles');
  }

  async signInWithOAuth(provider: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Mock implementation
      const user: UserProfile = {
        id: '456',
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar_url: `https://via.placeholder.com/150?text=${provider}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'demo_token');
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  // Account linking
  async linkAccount(provider: string): Promise<boolean> {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error linking account:', error);
      return false;
    }
  }

  onAuthEvent(callback: (event: any) => void) {
    // Mock implementation
    const listener = (e: StorageEvent) => {
      if (e.key === 'auth_user' || e.key === 'auth_token') {
        callback({
          type: e.key ? 'USER_UPDATED' : 'SIGNED_OUT',
          provider: 'email',
        });
      }
    };
    
    window.addEventListener('storage', listener);
    
    return {
      unsubscribe: () => {
        window.removeEventListener('storage', listener);
      }
    };
  }

  // Password management
  async resetPassword(email: string): Promise<void> {
    // Mock implementation
    console.log(`Password reset requested for ${email}`);
  }

  // User profile
  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Helper method for signing in - compatibility with old code
  signIn(provider: string) {
    return this.signInWithOAuth(provider);
  }
}

// Export the auth bridge as a singleton
export const authBridge = new AuthBridgeImpl();
