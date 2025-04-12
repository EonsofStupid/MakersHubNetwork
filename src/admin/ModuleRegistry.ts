
import { createStore } from 'zustand';
import { authBridge } from '@/auth/bridge';
import { UserRole } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

// Define the store state
interface ModuleRegistryState {
  registeredModules: Record<string, AdminModule>;
  activeModule: string | null;
  setActiveModule: (moduleId: string | null) => void;
  registerModule: (module: AdminModule) => void;
  unregisterModule: (moduleId: string) => void;
  isInitialized: boolean;
  initialize: () => Promise<void>;
}

// Define the admin module interface
export interface AdminModule {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  route: string;
  component: React.ComponentType<any>;
  requiredRoles?: UserRole[];
  settings?: Record<string, any>;
}

// Create the registry store
export const useModuleRegistry = createStore<ModuleRegistryState>((set, get) => ({
  registeredModules: {},
  activeModule: null,
  isInitialized: false,
  
  setActiveModule: (moduleId) => {
    set({ activeModule: moduleId });
  },
  
  registerModule: (module) => {
    set((state) => ({
      registeredModules: {
        ...state.registeredModules,
        [module.id]: module
      }
    }));
  },
  
  unregisterModule: (moduleId) => {
    set((state) => {
      const { [moduleId]: _, ...rest } = state.registeredModules;
      return { registeredModules: rest };
    });
  },
  
  initialize: async () => {
    const logger = useLogger('ModuleRegistry', LogCategory.ADMIN);
    
    try {
      logger.info('Initializing Admin Module Registry');
      
      // Listen for auth state changes to update modules based on permissions
      const unsubscribe = authBridge.onAuthEvent((event) => {
        if (event.type === 'AUTH_STATE_CHANGE') {
          logger.info('Auth state changed, updating module registry');
          
          // Here we would:
          // 1. Filter modules based on user permissions
          // 2. Update available modules
          // 3. Redirect if needed
        }
      });
      
      set({ isInitialized: true });
      
      logger.info('Admin Module Registry initialized');
      
      // Return unsubscribe function for cleanup
      return () => unsubscribe();
    } catch (error) {
      logger.error('Failed to initialize Admin Module Registry', {
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}));
