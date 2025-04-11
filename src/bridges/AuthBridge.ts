
// Auth bridge for cross-boundary communication
import { User, UserMetadata, UserProfile, UserRole, Permission } from "@/shared/types/shared.types";
import { LogCategory } from "@/shared/types/logging";
import { useLogger } from "@/shared/hooks/useLogger";

// Define auth event types
export type AuthEventType = 
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_STATE_CHANGED'
  | 'AUTH_PROFILE_UPDATED'
  | 'AUTH_SESSION_REFRESHED'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_LINKING_REQUIRED'
  | 'AUTH_ERROR';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

export type AuthEventHandler = (event: AuthEvent) => void;

// Auth bridge interface
export interface AuthBridgeImplementation {
  // Auth status
  status: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  
  // Core auth methods
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  getProfile: () => UserProfile | null;
  getUserRoles: () => UserRole[];
  
  // Role and permission methods
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  hasPermission: (permission: Permission) => boolean;
  
  // Event subscription
  subscribe: (handler: AuthEventHandler) => () => void;
  subscribeToEvent: (eventType: AuthEventType, handler: (event: AuthEvent) => void) => () => void;
  publish: (event: AuthEvent) => void;
  
  // Account management
  linkSocialAccount: (provider: string) => Promise<boolean>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<UserProfile | null>;
}

// Simple implementation
class AuthBridgeClass implements AuthBridgeImplementation {
  private currentUser: User | null = null;
  private currentProfile: UserProfile | null = null;
  private eventHandlers: AuthEventHandler[] = [];
  private logger = useLogger("AuthBridge", LogCategory.AUTH);
  
  constructor() {
    this.logger.info("Initializing AuthBridge");
  }

  // Auth status getter
  get status() {
    return {
      isAuthenticated: !!this.currentUser,
      isLoading: false
    };
  }

  // Core auth methods
  async signIn(email: string, password: string): Promise<User | null> {
    this.logger.info("Sign in attempt", { email });
    // Mock implementation - would connect to actual auth service
    this.currentUser = {
      id: "mock-user-id",
      email,
      user_metadata: {
        name: "Mock User",
        full_name: "Mock User",
      },
      app_metadata: {
        roles: ["user"]
      }
    };
    
    this.publish({
      type: 'AUTH_SIGNED_IN',
      payload: { user: this.currentUser }
    });
    
    return this.currentUser;
  }
  
  async signUp(email: string, password: string, metadata?: UserMetadata): Promise<User | null> {
    this.logger.info("Sign up attempt", { email });
    // Mock implementation
    this.currentUser = {
      id: "mock-user-id",
      email,
      user_metadata: {
        ...metadata,
        name: metadata?.name || email.split('@')[0],
        full_name: metadata?.full_name || email.split('@')[0],
      },
      app_metadata: {
        roles: ["user"]
      }
    };
    
    this.publish({
      type: 'AUTH_SIGNED_IN',
      payload: { user: this.currentUser }
    });
    
    return this.currentUser;
  }
  
  async signInWithGoogle(): Promise<User | null> {
    this.logger.info("Google sign in attempt");
    // Mock implementation
    this.currentUser = {
      id: "mock-google-user-id",
      email: "google-user@example.com",
      user_metadata: {
        name: "Google User",
        full_name: "Google User",
        avatar_url: "https://ui-avatars.com/api/?name=Google+User"
      },
      app_metadata: {
        roles: ["user"]
      }
    };
    
    this.publish({
      type: 'AUTH_SIGNED_IN',
      payload: { user: this.currentUser }
    });
    
    return this.currentUser;
  }
  
  async logout(): Promise<void> {
    this.logger.info("Logging out user", { userId: this.currentUser?.id });
    
    // Clear user data
    this.currentUser = null;
    this.currentProfile = null;
    
    this.publish({
      type: 'AUTH_SIGNED_OUT'
    });
  }
  
  getUser(): User | null {
    return this.currentUser;
  }
  
  getProfile(): UserProfile | null {
    return this.currentProfile;
  }
  
  getUserRoles(): UserRole[] {
    return this.currentUser?.app_metadata?.roles || [];
  }
  
  // Role and permission checks
  hasRole(role: UserRole | UserRole[]): boolean {
    if (!this.currentUser) return false;
    
    const userRoles = this.currentUser.app_metadata?.roles || [];
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  }
  
  isAdmin(): boolean {
    return this.hasRole(['admin', 'superadmin']);
  }
  
  isSuperAdmin(): boolean {
    return this.hasRole('superadmin');
  }
  
  hasPermission(permission: Permission): boolean {
    // Mock permission check - would connect to a real permission system
    return true;
  }
  
  // Event subscription
  subscribe(handler: AuthEventHandler): () => void {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }
  
  subscribeToEvent(eventType: AuthEventType, handler: (event: AuthEvent) => void): () => void {
    const wrappedHandler: AuthEventHandler = (event) => {
      if (event.type === eventType) {
        handler(event);
      }
    };
    return this.subscribe(wrappedHandler);
  }
  
  publish(event: AuthEvent): void {
    this.logger.debug(`Publishing auth event: ${event.type}`);
    this.eventHandlers.forEach(handler => handler(event));
  }
  
  // Account management
  async linkSocialAccount(provider: string): Promise<boolean> {
    this.logger.info(`Linking ${provider} account`);
    // Mock implementation
    return true;
  }
  
  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    this.logger.info("Updating user profile");
    
    if (!this.currentUser) {
      this.logger.error("Cannot update profile: No authenticated user");
      return null;
    }
    
    // Mock update profile logic
    this.currentProfile = {
      ...this.currentProfile,
      ...profile,
      id: profile.id || "mock-profile-id",
      user_id: this.currentUser.id,
      updated_at: new Date().toISOString()
    };
    
    this.publish({
      type: 'AUTH_PROFILE_UPDATED',
      payload: { profile: this.currentProfile }
    });
    
    return this.currentProfile;
  }
}

// Create singleton instance
export const authBridge: AuthBridgeImplementation = new AuthBridgeClass();

// Export event subscription and publishing functions
export const subscribeToAuthEvents = (eventType: AuthEventType, handler: (event: AuthEvent) => void): () => void => {
  return authBridge.subscribeToEvent(eventType, handler);
};

export const publishAuthEvent = (event: AuthEvent): void => {
  authBridge.publish(event);
};
