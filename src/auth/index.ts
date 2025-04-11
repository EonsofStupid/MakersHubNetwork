
/**
 * auth/index.ts
 * 
 * Central exports for the auth module
 */

// Re-export hooks
export * from './hooks/useHasRole';
export * from './hooks/useAuthState';
export * from './hooks/useAuth';
export * from './utils/hasRole';
export * from './rbac/enforce';

// Re-export components
export * from './components/AdminOnly';
export * from './components/RequirePermission';

// Re-export types
export * from './types/auth.types';

// Re-export from the AuthBridge
export { AuthBridge, subscribeToAuthEvents, publishAuthEvent } from '@/bridges/AuthBridge';
