
import { create } from 'zustand';
import { AuthStatus, UserRole } from '@/types/auth';

// Define allowed event types for type safety
export type AuthEventType = 'AUTH_SIGNED_IN' | 'AUTH_SIGNED_OUT' | 'AUTH_USER_UPDATED' | 'AUTH_SESSION_UPDATED' | 'AUTH_INITIALIZED' | 'AUTH_ERROR';

// AuthEvent interface with strict Record<string, unknown> implementation
export interface AuthEvent extends Record<string, unknown> {
  type: AuthEventType;
  payload?: Record<string, unknown>;
  timestamp?: number;
}

// Subscriber type
export type AuthEventSubscriber = (event: AuthEvent) => void;

// Store for auth subscribers
interface AuthBridgeState {
  subscribers: AuthEventSubscriber[];
  addSubscriber: (subscriber: AuthEventSubscriber) => () => void;
  removeSubscriber: (subscriber: AuthEventSubscriber) => void;
  publish: (event: AuthEvent) => void;
}

// Create the auth bridge store
const useAuthBridgeStore = create<AuthBridgeState>((set, get) => ({
  subscribers: [],
  
  addSubscriber: (subscriber) => {
    set(state => ({
      subscribers: [...state.subscribers, subscriber]
    }));
    
    // Return unsubscribe function
    return () => get().removeSubscriber(subscriber);
  },
  
  removeSubscriber: (subscriber) => {
    set(state => ({
      subscribers: state.subscribers.filter(s => s !== subscriber)
    }));
  },
  
  publish: (event) => {
    // Add timestamp if not provided
    const eventWithTimestamp = {
      ...event,
      timestamp: event.timestamp || Date.now()
    };
    
    // Notify all subscribers
    get().subscribers.forEach(subscriber => {
      try {
        subscriber(eventWithTimestamp);
      } catch (error) {
        console.error('Error in auth event subscriber:', error);
      }
    });
  }
}));

// Export the subscribe function
export function subscribeToAuthEvents(subscriber: AuthEventSubscriber): () => void {
  return useAuthBridgeStore.getState().addSubscriber(subscriber);
}

// Export the publish function
export function publishAuthEvent(event: AuthEvent): void {
  useAuthBridgeStore.getState().publish(event);
}

// Export the store if needed for advanced usage
export { useAuthBridgeStore };
