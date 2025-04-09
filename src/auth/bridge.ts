
import { useAuthStore } from './store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/auth/types/auth.types';
import { CircuitBreaker } from '@/utils/circuitBreaker';

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

// Create a circuit breaker to prevent infinite loops
const authCircuitBreaker = new CircuitBreaker('auth-bridge', 5, 5000);

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
  
  // Check if the circuit breaker is open to prevent excessive events
  if (authCircuitBreaker.isOpen) {
    logger.warn(`Auth event publishing stopped by circuit breaker: ${event.type}`, {
      category: LogCategory.AUTH,
      source: 'auth/bridge',
    });
    return;
  }
  
  // Log the event
  logger.debug(`Auth event published: ${event.type}`, {
    category: LogCategory.AUTH,
    source: 'auth/bridge',
    details: event
  });
  
  // Loop through all handlers and call them with the event
  eventHandlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      // Record failure on circuit breaker
      authCircuitBreaker.recordFailure();
      
      logger.error('Error in auth event handler', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { error, eventType: event.type }
      });
    }
  });
  
  // Record successful publishing
  authCircuitBreaker.recordSuccess();
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
    
    // Assign appropriate roles based on email 
    // For demo purposes, we'll give super_admin privileges to emails containing 'admin'
    let roles: UserRole[] = ['viewer'];
    
    if (email.includes('admin')) {
      roles = ['viewer', 'admin', 'super_admin'];
    } else if (email.includes('editor')) {
      roles = ['viewer', 'editor'];
    }
    
    store.setRoles(roles);
    
    // Publish auth event
    publishAuthEvent({
      type: 'AUTH_SIGNED_IN',
      payload: { user: mockUser, roles }
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
  
  // Read-only getter methods
  getUser: () => {
    return useAuthStore.getState().user;
  },
  
  getSession: () => {
    return useAuthStore.getState().session;
  },
  
  getRoles: () => {
    return useAuthStore.getState().roles;
  },
  
  getStatus: () => {
    return useAuthStore.getState().status;
  },
  
  // Role checking methods
  hasRole: (role: UserRole | UserRole[]) => {
    return useAuthStore.getState().hasRole(role);
  },
  
  isAdmin: () => {
    return useAuthStore.getState().isAdmin();
  },
  
  isSuperAdmin: () => {
    return useAuthStore.getState().roles.includes('super_admin');
  },
  
  // Add method to check debug access
  hasDebugAccess: () => {
    return useAuthStore.getState().roles.includes('super_admin');
  },
  
  // Check authentication status
  isAuthenticated: () => {
    return useAuthStore.getState().isAuthenticated;
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
  
  // Use a timestamp to track the last update we processed
  // This helps prevent event loops
  let lastUpdateProcessed = Date.now();
  
  // Subscribe to auth store changes to broadcast events
  const unsubscribe = useAuthStore.subscribe((state) => {
    // Skip if this update is too close to the last one we processed
    // This helps prevent cascading events or infinite loops
    if (state.lastUpdated <= lastUpdateProcessed) {
      return;
    }
    
    // Update our timestamp
    lastUpdateProcessed = state.lastUpdated;
    
    // Publish appropriate events based on state changes
    const { user, status } = state;
    
    // If user exists, publish user updated event
    if (user) {
      publishAuthEvent({
        type: 'AUTH_USER_UPDATED',
        payload: { user }
      });
    }
    
    // Publish state changed event
    publishAuthEvent({
      type: 'AUTH_STATE_CHANGED',
      payload: { status }
    });
  });
  
  // Clean up on window unload
  window.addEventListener('beforeunload', unsubscribe);
}
