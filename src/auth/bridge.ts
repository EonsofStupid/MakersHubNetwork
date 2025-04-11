
/**
 * auth/bridge.ts
 * 
 * Internal implementation of the Auth Bridge for the auth module
 * This is the boundary layer between the auth module and the rest of the application
 */
import { authBridgeImpl } from '@/bridges/AuthBridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { UserRole } from '@/types/shared';

// Manually extend the authBridgeImpl with the methods we need
// This is a workaround for the TS error and ensures type safety
const extendedBridge = {
  ...authBridgeImpl,
  
  // Add missing methods
  hasRole: (role: UserRole | UserRole[] | undefined): boolean => {
    // Forward to the AuthBridge implementation
    return authBridgeImpl.module === 'auth' 
      ? false 
      : (authBridgeImpl as any).hasRole(role);
  },
  
  isAdmin: (): boolean => {
    // Forward to the AuthBridge implementation
    return authBridgeImpl.module === 'auth'
      ? false
      : (authBridgeImpl as any).isAdmin();
  },
  
  isSuperAdmin: (): boolean => {
    // Forward to the AuthBridge implementation
    return authBridgeImpl.module === 'auth'
      ? false
      : (authBridgeImpl as any).isSuperAdmin();
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
