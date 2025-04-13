
import { UserProfile, LogCategory, LogLevel, AuthStatus, UserRole, ROLES } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';
import { RBACBridge } from '@/rbac/bridge';

/**
 * Implementation of the AuthBridge interface
 * Provides authentication functionality
 */
class AuthBridgeImpl {
  private loggerSource = 'AuthBridge';

  /**
   * Get the current authenticated session
   */
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    try {
      // Check local storage for demo user
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        return { user };
      }
      return null;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to get current session', { 
        details: { error },
        source: this.loggerSource
      });
      return null;
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<{ user_id: string } | null> {
    try {
      const session = await this.getCurrentSession();
      if (session?.user) {
        return { user_id: session.user.id };
      }
      return null;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to refresh session', { 
        details: { error },
        source: this.loggerSource
      });
      return null;
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: [ROLES.USER]
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify([ROLES.USER]));
      
      // Set roles in RBAC store
      RBACBridge.setRoles([ROLES.USER]);
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed in', { 
        details: { email },
        source: this.loggerSource
      });
      
      return { user: demoUser, error: null };
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Sign in failed', { 
        details: { error },
        source: this.loggerSource
      });
      return { user: null, error: error as Error };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email,
        name: 'New User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: [ROLES.USER]
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify([ROLES.USER]));
      
      // Set roles in RBAC store
      RBACBridge.setRoles([ROLES.USER]);
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed up', { 
        details: { email },
        source: this.loggerSource
      });
      
      return { user: demoUser, error: null };
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Sign up failed', { 
        details: { error },
        source: this.loggerSource
      });
      return { user: null, error: error as Error };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_roles');
      
      // Clear roles in RBAC store
      RBACBridge.clearRoles();
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed out', {
        source: this.loggerSource
      });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Sign out failed', { 
        details: { error },
        source: this.loggerSource
      });
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Demo implementation - in a real app, call an API
      const demoUser: UserProfile = {
        id: '123',
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: [ROLES.USER]
      };
      
      // Store user in local storage for demo
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_roles', JSON.stringify([ROLES.USER]));
      
      // Set roles in RBAC store
      RBACBridge.setRoles([ROLES.USER]);
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed in with OAuth', { 
        details: { provider },
        source: this.loggerSource
      });
      
      return { user: demoUser, error: null };
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'OAuth sign in failed', { 
        details: { error },
        source: this.loggerSource
      });
      return { user: null, error: error as Error };
    }
  }

  /**
   * Link an OAuth provider to the current account
   */
  async linkAccount(provider: string): Promise<boolean> {
    try {
      // Demo implementation - in a real app, call an API
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'Account linked', { 
        details: { provider },
        source: this.loggerSource
      });
      
      return true;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Account linking failed', { 
        details: { error },
        source: this.loggerSource
      });
      return false;
    }
  }

  /**
   * Subscribe to auth events
   */
  onAuthEvent(callback: (event: any) => void): { unsubscribe: () => void } {
    // Demo implementation - in a real app, set up real event listeners
    const unsubscribe = () => {};
    return { unsubscribe };
  }

  /**
   * Reset password for an email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      // Demo implementation - in a real app, call an API
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'Password reset requested', { 
        details: { email },
        source: this.loggerSource
      });
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Password reset failed', { 
        details: { error },
        source: this.loggerSource
      });
    }
  }

  /**
   * Get a user's profile
   */
  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    try {
      // If no userId provided, get the current user
      if (!userId) {
        const session = await this.getCurrentSession();
        return session?.user || null;
      }
      
      // Demo implementation - in a real app, call an API
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        if (user.id === userId) {
          return user;
        }
      }
      
      logger.log(LogLevel.WARN, LogCategory.AUTH, 'User profile not found', { 
        details: { userId },
        source: this.loggerSource
      });
      
      return null;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to get user profile', { 
        details: { error },
        source: this.loggerSource
      });
      return null;
    }
  }

  /**
   * Check if the current user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get the current authentication status
   */
  getAuthStatus(): AuthStatus {
    if (this.isAuthenticated()) {
      return AuthStatus.AUTHENTICATED;
    }
    return AuthStatus.UNAUTHENTICATED;
  }
}

// Export a singleton instance
export const authBridge = new AuthBridgeImpl();
