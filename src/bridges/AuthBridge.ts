
import { User, UserProfile, UserRole } from "@/shared/types/user";
import { canAccessAdmin, checkPermission, hasPermission } from "@/auth/rbac/enforce";

// Auth event types
export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'PROFILE_FETCHED';

// Auth event listener type
export type AuthEventListener = (event: AuthEventType, data?: any) => void;

// Auth status type
export type AuthStatus = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Implementation of the Auth Bridge
class AuthBridgeImplementation {
  private user: User | null = null;
  private profile: UserProfile | null = null;
  private eventListeners: AuthEventListener[] = [];
  
  status: AuthStatus = {
    isAuthenticated: false,
    isLoading: true
  };
  
  // Method to subscribe to auth events
  subscribeToAuthEvents(listener: AuthEventListener): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }
  
  // Method to publish auth events
  publishAuthEvent(event: AuthEventType, data?: any): void {
    this.eventListeners.forEach(listener => {
      listener(event, data);
    });
  }
  
  // Set the current user
  setUser(user: User | null): void {
    this.user = user;
    this.status.isAuthenticated = !!user;
    this.status.isLoading = false;
    
    if (user) {
      this.publishAuthEvent('USER_UPDATED', user);
    } else {
      this.publishAuthEvent('SIGNED_OUT');
    }
  }
  
  // Set the current user profile
  setProfile(profile: UserProfile | null): void {
    this.profile = profile;
    this.publishAuthEvent('PROFILE_FETCHED', profile);
  }
  
  // Get the current user
  getUser(): User | null {
    return this.user;
  }
  
  // Get the current user profile
  getProfile(): UserProfile | null {
    return this.profile;
  }
  
  // Login method
  async login(email: string, password: string): Promise<User | null> {
    // Implementation would go here
    // For now just mock a successful login
    const mockUser: User = {
      id: '123',
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.png'
      },
      app_metadata: {
        roles: ['user']
      },
      aud: 'authenticated'
    };
    
    this.setUser(mockUser);
    this.publishAuthEvent('SIGNED_IN', mockUser);
    return mockUser;
  }
  
  // Logout method
  async logout(): Promise<void> {
    this.setUser(null);
    this.setProfile(null);
    this.publishAuthEvent('SIGNED_OUT');
  }
  
  // Get user roles
  getUserRoles(): UserRole[] {
    if (!this.user || !this.user.app_metadata?.roles) {
      return [];
    }
    
    return this.user.app_metadata.roles as UserRole[];
  }
  
  // Check if user has role
  hasRole(role: UserRole | UserRole[]): boolean {
    const userRoles = this.getUserRoles();
    
    if (Array.isArray(role)) {
      return role.some(r => hasPermission(userRoles, r));
    }
    
    return hasPermission(userRoles, role);
  }
  
  // Check if user has admin access
  isAdmin(): boolean {
    return canAccessAdmin(this.getUserRoles());
  }
  
  // Check if user has super admin access
  isSuperAdmin(): boolean {
    return this.hasRole('superadmin');
  }
  
  // Check if user has permission
  hasPermission(permission: string): boolean {
    return checkPermission(this.getUserRoles(), permission);
  }
}

// Create and export a singleton instance
export const authBridge = new AuthBridgeImplementation();

// For compatibility with existing code
export const AuthBridge = authBridge;
