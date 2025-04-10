
/**
 * auth/bridge.ts
 * 
 * Internal implementation of the Auth Bridge for the auth module
 */
import { authBridgeImpl } from '@/bridges/AuthBridge';

// Re-export the bridge for use in the auth module
export const authBridge = authBridgeImpl;

// Re-export the bridge API for convenience
export { 
  AuthBridge, 
  subscribeToAuthEvents, 
  publishAuthEvent, 
  initializeAuthBridge
} from '@/bridges/AuthBridge';

// Re-export types
export type { AuthEventType, AuthEventPayload } from '@/bridges/AuthBridge';

