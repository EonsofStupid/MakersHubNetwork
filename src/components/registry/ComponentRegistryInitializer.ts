
import { registerSiteComponents } from '@/components/layout/SiteComponentRegistrations';
import { initializeComponentRegistry } from '@/admin/components/layout/ComponentRegistrations';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

/**
 * Initialize all component registries in the correct order
 * This ensures that components are available when layouts are loaded
 */
export function initializeAllComponentRegistries(): void {
  const logger = getLogger();
  
  try {
    logger.info('Starting component registry initialization', {
      category: LogCategory.SYSTEM
    });
    
    // Initialize site components first (public components)
    registerSiteComponents();
    logger.info('Site components registered successfully', {
      category: LogCategory.SYSTEM
    });
    
    // Then initialize admin components
    initializeComponentRegistry();
    logger.info('Admin components registered successfully', {
      category: LogCategory.SYSTEM
    });
    
    logger.info('All component registries initialized successfully', {
      category: LogCategory.SYSTEM
    });
  } catch (error) {
    logger.error('Failed to initialize component registries', {
      category: LogCategory.SYSTEM,
      details: error
    });
  }
}
