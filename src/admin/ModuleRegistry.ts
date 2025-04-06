
import { create } from 'zustand';

// Define module types
export type ModuleId = string;
export type ModuleType = 'core' | 'plugin' | 'extension';
export type ModuleStatus = 'active' | 'inactive' | 'error' | 'loading';

// Define module interface
export interface Module {
  id: ModuleId;
  name: string;
  type: ModuleType;
  status: ModuleStatus;
  version: string;
  dependencies?: string[];
  exports?: Record<string, unknown>;
}

// Define module registry state
interface ModuleRegistryState {
  modules: Record<ModuleId, Module>;
  registerModule: (module: Module, name?: string) => void;
  unregisterModule: (moduleId: ModuleId) => void;
  getModule: (moduleId: ModuleId) => Module | undefined;
  listModules: () => Module[];
}

// Create registry store
export const useModuleRegistry = create<ModuleRegistryState>((set, get) => ({
  modules: {},
  
  registerModule: (module: Module, name?: string) => {
    set((state) => {
      const updatedModule = name ? { ...module, name } : module;
      return {
        modules: {
          ...state.modules,
          [module.id]: updatedModule
        }
      };
    });
  },
  
  unregisterModule: (moduleId: ModuleId) => {
    set((state) => {
      const { [moduleId]: removedModule, ...remainingModules } = state.modules;
      return { modules: remainingModules };
    });
  },
  
  getModule: (moduleId: ModuleId) => {
    return get().modules[moduleId];
  },
  
  listModules: () => {
    return Object.values(get().modules);
  }
}));

// Export registry functions for external use
export const registerModule = (module: Module, name?: string): void => {
  useModuleRegistry.getState().registerModule(module, name);
};

export const unregisterModule = (moduleId: ModuleId): void => {
  useModuleRegistry.getState().unregisterModule(moduleId);
};

export const getModule = (moduleId: ModuleId): Module | undefined => {
  return useModuleRegistry.getState().getModule(moduleId);
};

export const listModules = (): Module[] => {
  return useModuleRegistry.getState().listModules();
};
