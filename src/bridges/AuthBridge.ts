
import { User } from '@supabase/supabase-js';
import { AuthEvent, AuthEventHandler, UserRole } from '@/shared/types';

/**
 * AuthBridge - Communication bridge for auth-related events and operations
 * This allows cross-module communication without direct dependencies
 */
class AuthBridgeClass {
  private eventHandlers: AuthEventHandler[] = [];
  private _user: User | null = null;
  private _isReady = false;

  /**
   * Subscribe to auth events
   * @param handler The event handler function
   * @returns Unsubscribe function
   */
  subscribeToAuthEvents(handler: AuthEventHandler): () => void {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Publish auth events to all subscribers
   * @param event The auth event to publish
   */
  publishAuthEvent(event: AuthEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in auth event handler:', error);
      }
    });

    // Update internal state on certain events
    if (event.type === 'SIGNED_IN' && event.payload?.user) {
      this._user = event.payload.user;
    } else if (event.type === 'SIGNED_OUT') {
      this._user = null;
    } else if (event.type === 'USER_UPDATED' && event.payload?.user) {
      this._user = event.payload.user;
    }
  }

  /**
   * Set the current user
   */
  setUser(user: User | null): void {
    this._user = user;
    this._isReady = true;
  }

  /**
   * Get the current user
   */
  getUser(): User | null {
    return this._user;
  }

  /**
   * Get user ID
   */
  getUserId(): string | null {
    return this._user?.id || null;
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this._user;
  }

  /**
   * Check if auth is ready
   */
  isReady(): boolean {
    return this._isReady;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    if (!this._user) return false;
    
    const userRole = this._user.user_metadata?.role as UserRole | undefined;
    if (!userRole) return false;
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return role === userRole;
  }

  /**
   * Check if the user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole(['admin', 'super_admin']);
  }

  /**
   * Check if the user is a super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    this.publishAuthEvent({
      type: 'SIGNED_OUT'
    });
  }
}

// Export a singleton instance
export const authBridge = new AuthBridgeClass();
