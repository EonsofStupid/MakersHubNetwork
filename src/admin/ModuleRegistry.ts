
import { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { authBridge } from '@/bridges/AuthBridge';
import { LogCategory, AuthEventType } from '@/shared/types/shared.types';

// Module interface
export interface AdminModule {
  id: string;
  name: string;
  description?: string;
  version: string;
  enabled: boolean;
  initialize: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

// Registry for admin modules
class AdminModuleRegistry {
  private modules: Map<string, AdminModule> = new Map();
  private initializedModules: Set<string> = new Set();
  private logger = useLogger('AdminModuleRegistry', LogCategory.SYSTEM);

  // Register a module
  register(module: AdminModule): void {
    if (this.modules.has(module.id)) {
      this.logger.warn(`Module with ID ${module.id} is already registered`, {
        moduleName: module.name
      });
      return;
    }

    this.modules.set(module.id, module);
    this.logger.debug(`Registered module: ${module.name}`, {
      moduleId: module.id
    });
  }

  // Initialize all modules
  async initializeAll(): Promise<void> {
    this.logger.info('Initializing all admin modules');
    
    for (const [id, module] of this.modules.entries()) {
      if (!module.enabled) {
        this.logger.debug(`Skipping disabled module: ${module.name}`);
        continue;
      }
      
      try {
        await module.initialize();
        this.initializedModules.add(id);
        this.logger.info(`Initialized module: ${module.name}`);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed to initialize module: ${module.name}`, {
          errorMessage: error
        });
      }
    }
  }

  // Cleanup all modules (on app shutdown/auth change)
  async cleanupAll(): Promise<void> {
    this.logger.info('Cleaning up admin modules');
    
    for (const [id, module] of this.modules.entries()) {
      if (!this.initializedModules.has(id) || !module.cleanup) continue;
      
      try {
        await module.cleanup();
        this.initializedModules.delete(id);
        this.logger.info(`Cleaned up module: ${module.name}`);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed to cleanup module: ${module.name}`, {
          errorMessage: error
        });
      }
    }
  }

  // Listen for auth changes
  setupAuthListeners(): () => void {
    return authBridge.subscribeToAuthEvents(async (event) => {
      if (event.type === AuthEventType.AUTH_STATE_CHANGE) {
        this.logger.debug('Auth state changed, reinitializing modules');
        await this.cleanupAll();
        await this.initializeAll();
      }
    });
  }
}

// Export singleton instance
export const adminRegistry = new AdminModuleRegistry();

// React hook to use the module registry
export function useAdminModuleRegistry() {
  const [initialized, setInitialized] = useState(false);
  const logger = useLogger('useAdminModuleRegistry', LogCategory.SYSTEM);
  
  useEffect(() => {
    const init = async () => {
      logger.debug('Initializing admin module registry');
      
      try {
        await adminRegistry.initializeAll();
        setInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        logger.error('Failed to initialize admin module registry', {
          errorMessage: error
        });
      }
    };
    
    init();
    
    const unsubscribe = adminRegistry.setupAuthListeners();
    
    return () => {
      unsubscribe();
      adminRegistry.cleanupAll();
    };
  }, [logger]);
  
  return { initialized };
}
