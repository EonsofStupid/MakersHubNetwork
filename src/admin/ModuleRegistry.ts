
import { LogCategory } from '@/logging/types';
import { Permission, UserRole } from '@/shared/types/auth.types';

// Module registration interface
interface Module {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  requiredRole: UserRole | UserRole[];
  requiredPermission: Permission[];
  category: 'core' | 'content' | 'system' | 'users' | 'analytics';
  enabled: boolean;
  order: number;
}

// Admin modules registry
class AdminModuleRegistry {
  private modules: Module[] = [];
  private logger: any;

  constructor() {
    // Logger will be initialized later
    this.logger = console;
  }

  // Initialize with logger
  init(logger: any) {
    this.logger = logger;
    this.logger.info('Admin module registry initialized', {}, LogCategory.ADMIN);
  }
  
  // Register a new module
  register(module: Module) {
    // Check if module already exists
    const existingModuleIndex = this.modules.findIndex(m => m.id === module.id);
    
    if (existingModuleIndex >= 0) {
      // Update existing module
      this.modules[existingModuleIndex] = { ...this.modules[existingModuleIndex], ...module };
      this.logger.debug(`Admin module ${module.id} updated`, { module }, LogCategory.ADMIN);
    } else {
      // Add new module
      this.modules.push(module);
      this.logger.debug(`Admin module ${module.id} registered`, { module }, LogCategory.ADMIN);
    }
    
    // Sort modules by order
    this.modules.sort((a, b) => a.order - b.order);
    
    return this;
  }
  
  // Get all modules
  getModules() {
    return [...this.modules];
  }
  
  // Get modules by category
  getModulesByCategory(category: Module['category']) {
    return this.modules.filter(m => m.category === category);
  }
  
  // Get enabled modules
  getEnabledModules() {
    return this.modules.filter(m => m.enabled);
  }
  
  // Get a specific module by ID
  getModule(id: string) {
    return this.modules.find(m => m.id === id);
  }
  
  // Enable a module
  enableModule(id: string) {
    const module = this.getModule(id);
    if (module) {
      module.enabled = true;
      this.logger.debug(`Admin module ${id} enabled`, { module }, LogCategory.ADMIN);
    }
    return this;
  }
  
  // Disable a module
  disableModule(id: string) {
    const module = this.getModule(id);
    if (module) {
      module.enabled = false;
      this.logger.debug(`Admin module ${id} disabled`, { module }, LogCategory.ADMIN);
    }
    return this;
  }
}

// Create and export the singleton instance
export const adminModuleRegistry = new AdminModuleRegistry();
