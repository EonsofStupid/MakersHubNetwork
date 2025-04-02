
import { registerSiteComponents } from '@/components/layout/SiteComponentRegistrations';
import { initializeComponentRegistry } from '@/admin/components/layout/ComponentRegistrations';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

/**
 * Initialize all component registries in the correct order
 * This ensures that components are available when layouts are loaded
 */
export function initializeAllComponentRegistries(): Promise<void> {
  const logger = getLogger('ComponentRegistryInitializer');
  
  return new Promise((resolve, reject) => {
    try {
      logger.info('Starting component registry initialization', {
        category: LogCategory.SYSTEM
      });
      
      // Initialize site components first (public components)
      try {
        registerSiteComponents();
        logger.info('Site components registered successfully', {
          category: LogCategory.SYSTEM
        });
      } catch (error) {
        logger.error('Failed to register site components', {
          category: LogCategory.SYSTEM,
          details: safeDetails(error)
        });
        // Continue with admin components even if site components fail
      }
      
      // Then initialize admin components
      try {
        initializeComponentRegistry();
        logger.info('Admin components registered successfully', {
          category: LogCategory.SYSTEM
        });
      } catch (error) {
        logger.error('Failed to register admin components', {
          category: LogCategory.SYSTEM,
          details: safeDetails(error)
        });
      }
      
      logger.info('Component registry initialization completed', {
        category: LogCategory.SYSTEM
      });
      
      // Resolve the promise to indicate completion
      resolve();
    } catch (error) {
      logger.error('Fatal error during component registry initialization', {
        category: LogCategory.SYSTEM,
        details: safeDetails(error)
      });
      reject(error);
    }
  });
}
