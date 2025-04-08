
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';
import { AuthEvent, AuthEventListener, AuthEventType } from './types/auth.types';

// Event listeners registry
const authEventListeners: AuthEventListener[] = [];

/**
 * Subscribe to authentication events
 * @param listener The listener function to call when auth events occur
 * @returns A function to unsubscribe the listener
 */
export function subscribeToAuthEvents(listener: AuthEventListener): () => void {
  authEventListeners.push(listener);
  
  getLogger().debug('Auth listener registered', {
    category: LogCategory.AUTH,
    source: 'AuthBridge',
    details: {
      listenersCount: authEventListeners.length
    }
  } as LogOptions);
  
  // Return unsubscribe function
  return () => {
    const index = authEventListeners.indexOf(listener);
    if (index > -1) {
      authEventListeners.splice(index, 1);
      
      getLogger().debug('Auth listener unregistered', {
        category: LogCategory.AUTH,
        source: 'AuthBridge',
        details: {
          listenersCount: authEventListeners.length
        }
      } as LogOptions);
    }
  };
}

/**
 * Dispatch an authentication event to all listeners
 * @param event The auth event to dispatch
 */
export function dispatchAuthEvent(event: AuthEvent): void {
  getLogger().info(`Auth event dispatched: ${event.type}`, {
    category: LogCategory.AUTH,
    source: 'AuthBridge',
    details: { type: event.type }
  } as LogOptions);
  
  // Use setTimeout to prevent circular dependencies
  setTimeout(() => {
    authEventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        getLogger().error('Error in auth event listener', {
          category: LogCategory.AUTH,
          source: 'AuthBridge',
          details: {
            error,
            eventType: event.type
          }
        } as LogOptions);
      }
    });
  }, 0);
}

/**
 * Helper functions to dispatch specific auth events with legacy type support
 */
export function dispatchSignInEvent(payload?: any): void {
  // Dispatch both current and legacy event types for backward compatibility
  dispatchAuthEvent({ type: 'SIGNED_IN', payload });
  dispatchAuthEvent({ type: 'AUTH_SIGNED_IN' as AuthEventType, payload });
}

export function dispatchSignOutEvent(payload?: any): void {
  // Dispatch both current and legacy event types for backward compatibility
  dispatchAuthEvent({ type: 'SIGNED_OUT', payload });
  dispatchAuthEvent({ type: 'AUTH_SIGNED_OUT' as AuthEventType, payload });
}
