
import { create } from 'zustand';

// Define event types
export type AuthEvent = 'login' | 'logout' | 'initialized' | 'error' | 'roleChange';

// Define the event listener type
type EventListener = (data?: any) => void;

// Create a store to manage event listeners
interface AuthBridge {
  listeners: Record<AuthEvent, EventListener[]>;
  subscribe: (event: AuthEvent, listener: EventListener) => () => void;
  publish: (event: AuthEvent, data?: any) => void;
}

const useAuthBridgeStore = create<AuthBridge>((set, get) => ({
  listeners: {
    login: [],
    logout: [],
    initialized: [],
    error: [],
    roleChange: []
  },
  
  subscribe: (event: AuthEvent, listener: EventListener) => {
    set(state => ({
      listeners: {
        ...state.listeners,
        [event]: [...state.listeners[event], listener]
      }
    }));
    
    // Return unsubscribe function
    return () => {
      set(state => ({
        listeners: {
          ...state.listeners,
          [event]: state.listeners[event].filter(l => l !== listener)
        }
      }));
    };
  },
  
  publish: (event: AuthEvent, data?: any) => {
    get().listeners[event].forEach(listener => listener(data));
  }
}));

// Export methods to interact with the bridge
export const subscribeToAuthEvents = (event: AuthEvent, listener: EventListener) => {
  return useAuthBridgeStore.getState().subscribe(event, listener);
};

export const publishAuthEvent = (event: AuthEvent, data?: any) => {
  useAuthBridgeStore.getState().publish(event, data);
};
