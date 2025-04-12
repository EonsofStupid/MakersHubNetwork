
import { EventEmitter } from 'events';
import { AuthEvent, AuthEventType, AuthStatus, User } from '@/shared/types/shared.types';

class AuthBridgeImpl {
  private emitter: EventEmitter;
  private _user: User | null = null;
  private _status: AuthStatus = AuthStatus.INITIAL;

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

  // Auth operations (to be implemented with actual auth provider)
  public async signInWithEmail(email: string, password: string): Promise<User> {
    // Implementation would connect to real auth provider
    try {
      // Simulate auth flow
      this._status = AuthStatus.LOADING;
      this.dispatchEvent('AUTH_STATE_CHANGE', { status: AuthStatus.LOADING });
      
      // Simulate successful login
      this._user = {
        id: '123',
        email: email,
        roles: ['user']
      };
      
      this._status = AuthStatus.AUTHENTICATED;
      this.dispatchEvent('AUTH_SIGNIN', { user: this._user });
      this.dispatchEvent('AUTH_STATE_CHANGE', { 
        status: AuthStatus.AUTHENTICATED,
        user: this._user
      });
      
      return this._user;
    } catch (error) {
      this._status = AuthStatus.ERROR;
      this.dispatchEvent('AUTH_ERROR', { error });
      throw error;
    }
  }

  public async signInWithGoogle(): Promise<User> {
    // Implementation would connect to real auth provider
    try {
      this._status = AuthStatus.LOADING;
      this.dispatchEvent('AUTH_STATE_CHANGE', { status: AuthStatus.LOADING });
      
      // Simulate successful Google login
      this._user = {
        id: '456',
        email: 'google-user@example.com',
        roles: ['user']
      };
      
      this._status = AuthStatus.AUTHENTICATED;
      this.dispatchEvent('AUTH_SIGNIN', { user: this._user });
      this.dispatchEvent('AUTH_STATE_CHANGE', { 
        status: AuthStatus.AUTHENTICATED,
        user: this._user
      });
      
      return this._user;
    } catch (error) {
      this._status = AuthStatus.ERROR;
      this.dispatchEvent('AUTH_ERROR', { error });
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      this._status = AuthStatus.LOADING;
      this.dispatchEvent('AUTH_STATE_CHANGE', { status: AuthStatus.LOADING });
      
      // Clear user data
      this._user = null;
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
