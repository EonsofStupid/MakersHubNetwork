
import { useAuthStore } from './store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { atom } from 'jotai';
import { UserRole } from '@/types/auth.types';
import { User } from '@supabase/supabase-js';

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

// Define central Jotai atoms for auth state
// These will be the single source of truth for UI components
export const userAtom = atom<User | null>(null);
export const rolesAtom = atom<UserRole[]>([]);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isAdminAtom = atom<boolean>(false);
export const hasAdminAccessAtom = atom<boolean>(false);

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
    
    // Create mock user for demo purposes
    // In a real app, this would call supabase.auth.signInWithPassword
    const mockUser = {
      id: '123456',
      email: email,
      user_metadata: {
        full_name: 'Cyber User',
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      }
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('impulse_user', JSON.stringify(mockUser));
    
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
    
    // Publish auth event
    publishAuthEvent({
      type: 'AUTH_SIGNED_OUT'
    });
  },
  
  // Role checking
  hasRole: (role: UserRole) => {
    const roles = useAuthStore.getState().roles;
    return roles.includes(role);
  },
  
  isAdmin: () => {
    const roles = useAuthStore.getState().roles;
    return roles.includes('admin') || roles.includes('super_admin');
  }
};

// Atom setters that properly wraps Jotai atom updates to prevent errors
const setAtomValue = <T>(atomObj: any, value: T) => {
  try {
    // Get the proper setter function for the atom
    const setter = atomObj.write || atomObj.set;
    if (setter && typeof setter === 'function') {
      setter(value);
    } else {
      console.error('No setter found for atom:', atomObj);
    }
  } catch (err) {
    console.error('Error updating atom:', err);
  }
};

/**
 * Initialize auth bridge by subscribing to auth store changes
 * and syncing with Jotai atoms
 */
export function initializeAuthBridge(): void {
  const logger = getLogger();
  logger.info('Initializing auth bridge', {
    category: LogCategory.AUTH,
    source: 'auth/bridge'
  });
  
  // Initialize atoms from store on startup
  const syncAtomsFromStore = () => {
    const { user, roles, status } = useAuthStore.getState();
    const isAuthenticated = status === 'authenticated';
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    const hasAdminAccess = isAdmin;
    
    try {
      // Use the atom primitive methods from jotai
      userAtom.write = (get, set) => set(userAtom, user);
      rolesAtom.write = (get, set) => set(rolesAtom, roles);
      isAuthenticatedAtom.write = (get, set) => set(isAuthenticatedAtom, isAuthenticated);
      isAdminAtom.write = (get, set) => set(isAdminAtom, isAdmin);
      hasAdminAccessAtom.write = (get, set) => set(hasAdminAccessAtom, hasAdminAccess);
      
      // Log successful sync
      logger.debug('Atoms synced from store', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { 
          hasUser: !!user, 
          roles, 
          isAuthenticated,
          isAdmin
        }
      });
    } catch (err) {
      logger.error('Error syncing atoms', {
        category: LogCategory.AUTH,
        source: 'auth/bridge',
        details: { err }
      });
    }
  };
  
  // Initial sync with error handling
  try {
    syncAtomsFromStore();
  } catch (err) {
    logger.error('Failed to sync atoms from store', {
      category: LogCategory.AUTH,
      source: 'auth/bridge',
      details: { err }
    });
  }
  
  // Setup auth state listener
  const unsubscribe = useAuthStore.subscribe(
    state => ({ user: state.user, roles: state.roles, status: state.status }),
    (current, prev) => {
      // Only update atoms if actual changes occurred
      if (
        current.user !== prev.user || 
        current.roles !== prev.roles || 
        current.status !== prev.status
      ) {
        try {
          syncAtomsFromStore();
        } catch (err) {
          logger.error('Failed to sync atoms on state change', {
            category: LogCategory.AUTH,
            source: 'auth/bridge',
            details: { err }
          });
        }
      }
    }
  );
  
  // Clean up on window unload
  window.addEventListener('beforeunload', unsubscribe);
}
