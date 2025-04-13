
import { IAuthBridge } from '@/auth/bridge';
import { UserProfile, LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

/**
 * Auth Bridge Implementation
 * 
 * This is a concrete implementation of the AuthBridge interface that
 * provides authentication functionality for the application.
 */
class AuthBridgeImpl implements IAuthBridge {
  private eventSubscribers: Map<string, ((event: any) => void)[]> = new Map();
  private _isAuthenticated: boolean = false;

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  // Session management
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    try {
      // In a real implementation, this would check for an existing session
      // in localStorage or via an API call
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        this._isAuthenticated = true;
        return { user: JSON.parse(storedUser) };
      }
      this._isAuthenticated = false;
      return null;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to get current session', { 
        details: { errorMessage: error instanceof Error ? error.message : String(error) } 
      });
      this._isAuthenticated = false;
      return null;
    }
  }

  async refreshSession(): Promise<{ user_id: string } | null> {
    try {
      // In a real implementation, this would refresh the auth token
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        this._isAuthenticated = true;
        return { user_id: user.id };
      }
      this._isAuthenticated = false;
      return null;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to refresh session', { 
        details: { errorMessage: error instanceof Error ? error.message : String(error) } 
      });
      this._isAuthenticated = false;
      return null;
    }
  }

  // Authentication methods
  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // For demo purposes
      const user: UserProfile = {
        id: 'demo-user-id',
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'demo-token');
      this._isAuthenticated = true;
      
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed in with email', { 
        details: { email } 
      });

      return { user, error: null };
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to sign in with email', { 
        details: { email, errorMessage: error instanceof Error ? error.message : String(error) } 
      });
      this._isAuthenticated = false;
      return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // For demo purposes
      const user: UserProfile = {
        id: 'demo-user-id',
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'demo-token');
      this._isAuthenticated = true;

      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed up with email', { 
        details: { email } 
      });

      return { user, error: null };
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to sign up with email', { 
        details: { email, errorMessage: error instanceof Error ? error.message : String(error) } 
      });
      this._isAuthenticated = false;
      return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_roles');
      this._isAuthenticated = false;

      logger.log(LogLevel.INFO, LogCategory.AUTH, 'User signed out');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to sign out', { 
        details: { errorMessage: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  subscribeToEvent(event: string, callback: (event: any) => void): { unsubscribe: () => void } {
    if (!this.eventSubscribers.has(event)) {
      this.eventSubscribers.set(event, []);
    }
    
    this.eventSubscribers.get(event)?.push(callback);
    
    return {
      unsubscribe: () => {
        const subscribers = this.eventSubscribers.get(event) || [];
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }
  
  onAuthEvent(callback: (event: any) => void): { unsubscribe: () => void } {
    return this.subscribeToEvent('auth', callback);
  }
  
  async resetPassword(email: string): Promise<void> {
    try {
      logger.log(LogLevel.INFO, LogCategory.AUTH, 'Password reset requested', { 
        details: { email }
      });
      // Mock implementation
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to reset password', { 
        details: { email, error: String(error) }
      });
      throw error;
    }
  }
  
  getUser(): UserProfile | null {
    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to get user', { 
        details: { error: String(error) }
      });
      return null;
    }
  }

  getProfile(): UserProfile | null {
    return this.getUser();
  }
}

// Create and export a singleton instance
export const authBridge = new AuthBridgeImpl();
