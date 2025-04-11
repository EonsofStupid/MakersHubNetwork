
/**
 * auth/bridge.ts
 * 
 * Internal implementation of the Auth Bridge for the auth module
 * This is the boundary layer between the auth module and the rest of the application
 */
import { authBridgeImpl } from '@/bridges/AuthBridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { UserRole } from '@/types/shared';

// Create a type-safe proxy to the authBridgeImpl
const extendedBridge = {
  ...authBridgeImpl,
  
  // Add missing methods with proper typing
  hasRole: (role: UserRole | UserRole[] | undefined): boolean => {
    return authBridgeImpl.hasRole ? authBridgeImpl.hasRole(role) : false;
  },
  
  isAdmin: (): boolean => {
    return authBridgeImpl.isAdmin ? authBridgeImpl.isAdmin() : false;
  },
  
  isSuperAdmin: (): boolean => {
    return authBridgeImpl.isSuperAdmin ? authBridgeImpl.isSuperAdmin() : false;
  }
};

// Re-export the extended bridge for use in the auth module
export const authBridge = extendedBridge;

// Re-export the bridge API for convenience
export { 
  AuthBridge, 
  subscribeToAuthEvents, 
  publishAuthEvent, 
  initializeAuthBridge
} from '@/bridges/AuthBridge';

// Re-export types
export type { AuthEventType, AuthEventPayload } from '@/bridges/AuthBridge';

/**
 * Register a listener for auth events
 * This is a convenience function for auth module internal use
 */
export function registerAuthEventListener(event: string, handler: (payload: any) => void) {
  const logger = getLogger();
  
  logger.debug(`Registering auth event listener for ${event}`, {
    category: LogCategory.AUTH
  });
  
  return authBridge.subscribe(event, handler);
}

/**
 * Check if user has specified role(s)
 * This is a convenience function for auth module internal use
 */
export function hasRole(role: UserRole | UserRole[] | undefined): boolean {
  return authBridge.hasRole(role);
}

/**
 * Check if user is an admin
 * This is a convenience function for auth module internal use
 */
export function isAdmin(): boolean {
  return authBridge.isAdmin();
}

/**
 * Check if user is a super admin
 * This is a convenience function for auth module internal use
 */
export function isSuperAdmin(): boolean {
  return authBridge.isSuperAdmin();
}
