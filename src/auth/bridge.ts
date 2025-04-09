
import { useAuthStore } from './store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth.types';

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
 * Export auth methods that will be available through AuthBridge
 * This provides a centralized API for authentication
 */
export const AuthBridge = {
  // Authentication methods
  signIn: async (email: string, password: string) => {
    const logger = getLogger();
    logger.info('AuthBridge: signIn attempt', {
      category: LogCategory.AUTH,
      source: 'auth/bridge',
      details: { email }
    });
    
    // Create mock user for demo purposes with proper type casting
    // In a real app, this would call supabase.auth.signInWithPassword
    const mockUser = {
      id: '123456',
      email: email,
      app_metadata: { provider: 'email' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: '',
      user_metadata: {
        full_name: 'Cyber User',
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      }
    } as User;
    
    // Save to localStorage for persistence
    localStorage.setItem('impulse_user', JSON.stringify(mockUser));
    
    // Update the auth store directly
    const store = useAuthStore.getState();
    store.setUser(mockUser);
    store.setRoles(['viewer']);
    
    // Publish auth event
    publishAuthEvent({
      type: 'AUTH_SIGNED_IN',
      payload: { user: mockUser }
    });
    
    return mockUser;
  },
  
  logout: async () => {
    const logger = getLogger();
    logger.info('AuthBridge: logout', {
      category: LogCategory.AUTH,
      source: 'auth/bridge'
    });
    
    // In a real app, this would call supabase.auth.signOut
    localStorage.removeItem('impulse_user');
    
    // Update store directly
    await useAuthStore.getState().logout();
    
    // Publish auth event
    publishAuthEvent({
      type: 'AUTH_SIGNED_OUT'
    });
  },
  
  // Role checking
  hasRole: (role: UserRole) => {
    return useAuthStore.getState().hasRole(role);
  },
  
  isAdmin: () => {
    return useAuthStore.getState().isAdmin();
  }
};

/**
 * Initialize auth bridge by subscribing to auth store changes
 * and broadcasting events
 */
export function initializeAuthBridge(): void {
  const logger = getLogger();
  logger.info('Initializing auth bridge', {
    category: LogCategory.AUTH,
    source: 'auth/bridge'
  });
  
  // Check for stored user on startup
  const storedUser = localStorage.getItem('impulse_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as User;
      
      // Update the store with the stored user
      const store = useAuthStore.getState();
      store.setUser(user);
      store.setRoles(['viewer']); // Default role
      store.setInitialized(true);
      
      logger.info('Restored user from local storage', {
        category: LogCategory.AUTH,
        source: 'auth/bridge'
      });
    } catch (err) {
      logger.error('Failed to parse stored user', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { err }
      });
    }
  }
  
  // Subscribe to auth store changes to broadcast events
  // Fix: Update the subscribe call to match the current Zustand API
  // Only pass one callback function that receives the new state
  const unsubscribe = useAuthStore.subscribe((state) => {
    const { user, status } = state;
    
    // If user exists, publish user updated event
    if (user) {
      publishAuthEvent({
        type: 'AUTH_USER_UPDATED',
        payload: { user }
      });
    }
    
    // If status changed, publish state changed event
    publishAuthEvent({
      type: 'AUTH_STATE_CHANGED',
      payload: { status }
    });
  });
  
  // Clean up on window unload
  window.addEventListener('beforeunload', unsubscribe);
}
