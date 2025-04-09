
import { useAuthStore } from './store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Define the event types
export type AuthEventType = 
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_STATE_CHANGED'
  | 'AUTH_SESSION_REFRESH'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_ROLES_UPDATED'
  | 'AUTH_PERMISSION_CHANGED';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

type AuthEventHandler = (event: AuthEvent) => void;

// Create a simple event system
const eventHandlers: AuthEventHandler[] = [];

/**
 * Subscribe to auth events
 * @param handler The handler function to call when an event occurs
 * @returns Unsubscribe function
 */
export function subscribeToAuthEvents(handler: AuthEventHandler): () => void {
  eventHandlers.push(handler);
  
  return () => {
    const index = eventHandlers.indexOf(handler);
    if (index !== -1) {
      eventHandlers.splice(index, 1);
    }
  };
}

/**
 * Publish an auth event
 * @param event The event to publish
 */
export function publishAuthEvent(event: AuthEvent): void {
  const logger = getLogger();
  logger.debug(`Auth event published: ${event.type}`, {
    category: LogCategory.AUTH,
    source: 'auth/bridge',
    details: event
  });
  
  eventHandlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      logger.error('Error in auth event handler', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error, eventType: event.type }
      });
    }
  });
}

/**
 * Initialize auth bridge by subscribing to auth store changes
 */
export function initializeAuthBridge(): void {
  const logger = getLogger();
  logger.info('Initializing auth bridge', {
    category: LogCategory.AUTH,
    source: 'auth/bridge'
  });
  
  // Setup auth state listener
  const unsubscribe = useAuthStore.subscribe(
    (state, prevState) => {
      // User signed in
      if (!prevState.user && state.user) {
        publishAuthEvent({
          type: 'AUTH_SIGNED_IN',
          payload: { user: state.user }
        });
      }
      
      // User signed out
      if (prevState.user && !state.user) {
        publishAuthEvent({
          type: 'AUTH_SIGNED_OUT'
        });
      }
      
      // Session changed
      if (prevState.session !== state.session) {
        publishAuthEvent({
          type: 'AUTH_SESSION_REFRESH',
          payload: { session: state.session }
        });
      }
      
      // User updated
      if (prevState.user !== state.user && prevState.user && state.user) {
        publishAuthEvent({
          type: 'AUTH_USER_UPDATED',
          payload: { 
            previous: prevState.user,
            current: state.user
          }
        });
      }
      
      // Roles updated
      if (prevState.roles !== state.roles) {
        publishAuthEvent({
          type: 'AUTH_ROLES_UPDATED',
          payload: { roles: state.roles }
        });
      }
      
      // Permissions might have changed
      if (prevState.roles !== state.roles) {
        publishAuthEvent({
          type: 'AUTH_PERMISSION_CHANGED',
          payload: { roles: state.roles }
        });
      }
    }
  );
  
  // Clean up on window unload
  window.addEventListener('beforeunload', () => {
    unsubscribe();
  });
}
