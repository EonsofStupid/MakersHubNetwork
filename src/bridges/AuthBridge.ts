
/**
 * AuthBridge.ts
 * 
 * Provides a bridge between the auth module and the rest of the application.
 * This allows other modules to interact with authentication without direct dependencies.
 */

import { User, UserRole } from "@/types/user.types";
import { messageBus } from "./MessageBus";

export type AuthEventType = 
  | 'login'
  | 'logout'
  | 'register'
  | 'profile-update'
  | 'session-expired'
  | 'password-reset'
  | 'email-verification';

export interface AuthEvent {
  type: AuthEventType;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class AuthBridgeClass {
  private user: User | null = null;
  private roles: UserRole[] = [];
  private authenticated: boolean = false;
  private messageBusInterface = messageBus.createInterface('auth');

  constructor() {
    // Initialize auth bridge
    console.log('Auth bridge initialized');
  }

  // User management
  public setCurrentUser(user: User | null): void {
    this.user = user;
    this.authenticated = !!user;
    this.publishAuthEvent('login', { userId: user?.id });
  }

  public getUserId(): string | undefined {
    return this.user?.id;
  }

  public getCurrentUser(): User | null {
    return this.user;
  }

  // Auth state
  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Role management
  public setRoles(roles: UserRole[]): void {
    this.roles = roles;
  }

  public getRoles(): UserRole[] {
    return this.roles;
  }

  public hasRole(role: UserRole | UserRole[]): boolean {
    if (Array.isArray(role)) {
      return role.some(r => this.roles.includes(r));
    }
    return this.roles.includes(role);
  }

  // Event handling
  public subscribeToAuthEvents(handler: (event: AuthEvent) => void): () => void {
    return this.messageBusInterface.subscribe('events', handler);
  }

  public publishAuthEvent(type: AuthEventType, metadata?: Record<string, any>): void {
    const event: AuthEvent = {
      type,
      userId: this.user?.id,
      timestamp: Date.now(),
      metadata
    };
    this.messageBusInterface.publish('events', event);
  }
}

// Create a singleton instance
export const AuthBridge = new AuthBridgeClass();

// Helper functions for external modules to use
export function subscribeToAuthEvents(handler: (event: AuthEvent) => void): () => void {
  return AuthBridge.subscribeToAuthEvents(handler);
}

export function publishAuthEvent(type: AuthEventType, metadata?: Record<string, any>): void {
  AuthBridge.publishAuthEvent(type, metadata);
}

export function initializeAuthBridge(): void {
  // Any initialization logic for the auth bridge
  console.log('Auth bridge ready for events');
}
