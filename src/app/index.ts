
/**
 * app/index.ts
 * 
 * Main application module exports
 * This will serve as the isolated app module entry point
 */

// In future refactoring, we'll move app-specific components here
// For now, we'll just establish the module boundary

import { messageBus } from '@/bridges/MessageBus';

// Initialize app module
const appMessaging = messageBus.createInterface('app');

// Export app-specific messaging
export { appMessaging };

// App event types
export type AppEventType =
  | 'APP_INITIALIZED'
  | 'APP_ERROR'
  | 'APP_ROUTE_CHANGED'
  | 'APP_THEME_CHANGED';

// App initialization function
export const initializeApp = () => {
  // Let other modules know the app is ready
  appMessaging.publish('lifecycle', { type: 'APP_INITIALIZED' });
};
