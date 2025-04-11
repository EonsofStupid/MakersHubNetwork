
import { User, UserRole } from "@/shared/types";

export interface AuthBridgeClass {
  getUser: () => User | null;
  getStatus: () => { isAuthenticated: boolean; isLoading: boolean };
  signIn: (email: string, password: string) => Promise<null>;
  signInWithGoogle: () => Promise<null>;
  logout: () => Promise<any>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  subscribeToAuthEvents: (callback: (user: User | null) => void) => () => void;
}

// Create a shared instance of the auth bridge
export class AuthBridgeImplementation implements AuthBridgeClass {
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Initialize with default values
    this.user = null;
  }

  getUser() {
    return this.user;
  }

  getStatus() {
    return {
      isAuthenticated: !!this.user,
      isLoading: false
    };
  }

  async signIn(email: string, password: string) {
    console.log('Sign in with email/password', email);
    // Mock implementation
    this.user = {
      id: '1',
      email,
      displayName: email.split('@')[0],
      roles: ['user'],
      metadata: {}
    };
    this.notifyListeners();
    return null;
  }

  async signInWithGoogle() {
    console.log('Sign in with Google');
    // Mock implementation
    this.user = {
      id: '1',
      email: 'google@example.com',
      displayName: 'Google User',
      roles: ['user'],
      metadata: {}
    };
    this.notifyListeners();
    return null;
  }

  async logout() {
    this.user = null;
    this.notifyListeners();
    return null;
  }

  hasRole(role: UserRole | UserRole[]) {
    if (!this.user) return false;
    
    const userRoles = this.user.roles || [];
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  }

  isAdmin() {
    return this.hasRole(['admin', 'super_admin']);
  }

  isSuperAdmin() {
    return this.hasRole('super_admin');
  }

  subscribeToAuthEvents(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  // For testing and event triggering
  publishAuthEvent(user: User | null) {
    this.user = user;
    this.notifyListeners();
  }
}

// Export a singleton instance
export const authBridge = new AuthBridgeImplementation();

// For backwards compatibility 
export const AuthBridge = authBridge;

// Helper method for publishing auth events
export const publishAuthEvent = (user: User | null) => authBridge.publishAuthEvent(user);
export const subscribeToAuthEvents = (callback: (user: User | null) => void) => authBridge.subscribeToAuthEvents(callback);
