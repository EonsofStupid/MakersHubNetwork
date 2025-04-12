
import { EventEmitter } from 'events';
import { AuthEvent, AuthEventType, AuthStatus, User, UserProfile, UserRole } from '@/shared/types/shared.types';

class AuthBridgeImpl {
  private emitter: EventEmitter;
  private _user: User | null = null;
  private _profile: UserProfile | null = null;
  private _status: AuthStatus = AuthStatus.INITIAL;
  private _roles: UserRole[] = [];

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(20); // Increase max listeners to avoid warnings
  }

  // Public methods
  public getUser(): User | null {
    return this._user;
  }

  public isAuthenticated(): boolean {
    return this._status === AuthStatus.AUTHENTICATED && !!this._user;
  }

  public getStatus(): AuthStatus {
    return this._status;
  }

  public getRoles(): UserRole[] {
    return this._roles;
  }

  public getUserProfile(): UserProfile | null {
    return this._profile;
  }

  public isAdmin(): boolean {
    return this._roles.includes('admin') || this._roles.includes('super_admin');
  }

  public isSuperAdmin(): boolean {
    return this._roles.includes('super_admin');
  }

  public getCurrentSession(): { user: User | null } | null {
    if (!this._user) return null;
    return { user: this._user };
  }

  // Auth operations (to be implemented with actual auth provider)
  public async signIn(email: string, password: string): Promise<User> {
    try {
      // Simulate auth flow
      this._status = AuthStatus.LOADING;
      this.dispatchEvent('AUTH_STATE_CHANGE', { status: AuthStatus.LOADING });
      
      // Simulate successful login
      this._user = {
        id: '123',
        email: email,
        user_metadata: {
          display_name: email.split('@')[0],
          avatar_url: ''
        },
        app_metadata: {
          roles: ['user']
        }
      };
      
      this._roles = this._user.app_metadata?.roles || ['user'];
      this._status = AuthStatus.AUTHENTICATED;
      
      this.dispatchEvent('AUTH_SIGNIN', { user: this._user });
      this.dispatchEvent('AUTH_STATE_CHANGE', { 
        status: AuthStatus.AUTHENTICATED,
        user: this._user
      });
      
      // Simulate profile fetch
      this._profile = {
        id: 'profile-123',
        user_id: this._user.id,
        display_name: this._user.user_metadata?.display_name,
        avatar_url: this._user.user_metadata?.avatar_url,
      };

      this.dispatchEvent('AUTH_PROFILE_UPDATED', { profile: this._profile });
      
      return this._user;
    } catch (error) {
      this._status = AuthStatus.ERROR;
      this.dispatchEvent('AUTH_ERROR', { error });
      throw error;
    }
  }

  public async signInWithGoogle(): Promise<User> {
    try {
      this._status = AuthStatus.LOADING;
      this.dispatchEvent('AUTH_STATE_CHANGE', { status: AuthStatus.LOADING });
      
      // Simulate successful Google login
      this._user = {
        id: '456',
        email: 'google-user@example.com',
        user_metadata: {
          display_name: 'Google User',
          avatar_url: 'https://example.com/avatar.png'
        },
        app_metadata: {
          roles: ['user']
        }
      };
      
      this._roles = this._user.app_metadata?.roles || ['user'];
      this._status = AuthStatus.AUTHENTICATED;
      
      this.dispatchEvent('AUTH_SIGNIN', { user: this._user });
      this.dispatchEvent('AUTH_STATE_CHANGE', { 
        status: AuthStatus.AUTHENTICATED,
        user: this._user
      });
      
      // Simulate profile fetch
      this._profile = {
        id: 'profile-456',
        user_id: this._user.id,
        display_name: this._user.user_metadata?.display_name,
        avatar_url: this._user.user_metadata?.avatar_url,
      };

      this.dispatchEvent('AUTH_PROFILE_UPDATED', { profile: this._profile });
      
      return this._user;
    } catch (error) {
      this._status = AuthStatus.ERROR;
      this.dispatchEvent('AUTH_ERROR', { error });
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      this._status = AuthStatus.LOADING;
      this.dispatchEvent('AUTH_STATE_CHANGE', { status: AuthStatus.LOADING });
      
      // Clear user data
      this._user = null;
      this._profile = null;
      this._roles = [];
      this._status = AuthStatus.UNAUTHENTICATED;
      
      this.dispatchEvent('AUTH_SIGNOUT', {});
      this.dispatchEvent('AUTH_STATE_CHANGE', { 
        status: AuthStatus.UNAUTHENTICATED,
        user: null
      });
    } catch (error) {
      this._status = AuthStatus.ERROR;
      this.dispatchEvent('AUTH_ERROR', { error });
      throw error;
    }
  }

  public async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (!this._profile || !this._user) {
        throw new Error("No authenticated user");
      }
      
      // Update profile
      this._profile = {
        ...this._profile,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Update user metadata to reflect changes
      if (this._user.user_metadata) {
        this._user.user_metadata = {
          ...this._user.user_metadata,
          display_name: updates.display_name || this._user.user_metadata.display_name,
          avatar_url: updates.avatar_url || this._user.user_metadata.avatar_url,
          bio: updates.bio || this._user.user_metadata.bio,
          theme_preference: updates.theme_preference || this._user.user_metadata.theme_preference,
          motion_enabled: updates.motion_enabled !== undefined ? updates.motion_enabled : this._user.user_metadata.motion_enabled,
          website: updates.website || this._user.user_metadata.website,
        };
      }
      
      this.dispatchEvent('AUTH_USER_UPDATED', { user: this._user });
      this.dispatchEvent('AUTH_PROFILE_UPDATED', { profile: this._profile });
      
      return this._profile;
    } catch (error) {
      this.dispatchEvent('AUTH_ERROR', { error });
      throw error;
    }
  }

  public async linkSocialAccount(provider: string): Promise<void> {
    // Implementation would handle account linking
    console.log(`Linking account with ${provider}`);
  }

  // Event handling
  private dispatchEvent(type: AuthEventType, payload?: Record<string, any>): void {
    const event: AuthEvent = {
      type,
      payload,
      timestamp: Date.now()
    };
    
    this.emitter.emit(type, event);
    // Also emit to ALL listeners
    this.emitter.emit('*', event);
  }

  public subscribeToEvent(type: AuthEventType | '*', handler: (event: AuthEvent) => void): () => void {
    this.emitter.on(type, handler);
    return () => this.emitter.off(type, handler);
  }

  public unsubscribeFromEvent(type: AuthEventType | '*', handler: (event: AuthEvent) => void): void {
    this.emitter.off(type, handler);
  }
}

// Create a singleton instance of AuthBridgeImpl
export const authBridge = new AuthBridgeImpl();

// Helper function to subscribe to auth events
export function subscribeToAuthEvents(handler: (event: AuthEvent) => void): () => void {
  return authBridge.subscribeToEvent('*', handler);
}

// Add initialization function for use in App.tsx
export function initializeAuthBridge(): void {
  console.log('Auth bridge initialized');
  // Additional initialization logic can be added here
}
