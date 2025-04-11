
/**
 * auth/index.ts
 * 
 * Central exports for the auth module
 */

// Re-export everything from the core modules
export * from './hooks/useHasRole';
export * from './utils/hasRole';
export * from './types/auth.types';

// Re-export from the AuthBridge
export { AuthBridge, subscribeToAuthEvents, publishAuthEvent } from '@/bridges/AuthBridge';
