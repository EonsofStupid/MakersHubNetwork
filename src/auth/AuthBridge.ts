
import { User, UserProfile } from '@/shared/types/auth.types';
import { AuthEvent, AuthEventType } from '@/shared/types/shared.types';
import { UserRole } from '@/shared/types/shared.types';

// Type for auth event callback
type AuthEventCallback = (event: AuthEvent) => void;

// Auth Bridge Interface
export interface AuthBridge {
  // Auth methods
  signIn(provider?: string): Promise<UserProfile | null>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  
  // Profile methods
  updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
  
  // Password methods
  resetPassword(email: string): Promise<void>;
  
  // Event subscription
  subscribeToAuthEvents(callback: AuthEventCallback): () => void;
  
  // Role checks
  hasRole(user: UserProfile | null, role: UserRole | UserRole[]): boolean;
  isAdmin(user: UserProfile | null): boolean;
  
  // Session management
  refreshSession(): Promise<UserProfile | null>;
}

// Auth Bridge Implementation
export class AuthBridgeImpl implements AuthBridge {
  private eventCallbacks: AuthEventCallback[] = [];
  
  // Auth methods
  async signIn(provider?: string): Promise<UserProfile | null> {
    // Placeholder implementation
    console.log("Sign in with provider:", provider);
    return null;
  }
  
  async signOut(): Promise<void> {
    // Placeholder implementation
    console.log("Sign out");
    this.emitEvent({
      type: AuthEventType.SIGNED_OUT,
      user: null
    });
  }
  
  async getCurrentUser(): Promise<UserProfile | null> {
    // Placeholder implementation
    return null;
  }
  
  // Profile methods
  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Placeholder implementation
    console.log("Update profile:", profile);
    
    // Create a mock updated user for the return value
    const updatedUser: UserProfile = {
      id: '123',
      roles: [UserRole.USER],
      ...profile
    };
    
    this.emitEvent({
      type: AuthEventType.PROFILE_UPDATED,
      user: updatedUser
    });
    
    return updatedUser;
  }
  
  // Password methods
  async resetPassword(email: string): Promise<void> {
    // Placeholder implementation
    console.log("Reset password for:", email);
    
    this.emitEvent({
      type: AuthEventType.PASSWORD_RECOVERY,
      user: null,
      metadata: { email }
    });
  }
  
  // Event subscription
  subscribeToAuthEvents(callback: AuthEventCallback): () => void {
    this.eventCallbacks.push(callback);
    
    return () => {
      this.eventCallbacks = this.eventCallbacks.filter(cb => cb !== callback);
    };
  }
  
  // Role checks
  hasRole(user: UserProfile | null, role: UserRole | UserRole[]): boolean {
    if (!user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.some(r => user.roles.includes(r));
  }
  
  isAdmin(user: UserProfile | null): boolean {
    if (!user) return false;
    return this.hasRole(user, [UserRole.ADMIN, UserRole.SUPERADMIN]);
  }
  
  // Session management
  async refreshSession(): Promise<UserProfile | null> {
    // Placeholder implementation
    console.log("Refresh session");
    return null;
  }
  
  // Helper method to emit events to subscribers
  private emitEvent(event: AuthEvent): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error("Error in auth event callback:", error);
      }
    });
  }
}

// Create the singleton instance
export const authBridge = new AuthBridgeImpl();
