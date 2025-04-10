
/**
 * auth/bridge.ts
 * 
 * Central export point for AuthBridge functionality
 * This file helps avoid circular dependencies by providing a single source of truth
 */

// Re-export everything from the main bridge
export { AuthBridge, subscribeToAuthEvents, publishAuthEvent, initializeAuthBridge } from '@/bridges/AuthBridge';
