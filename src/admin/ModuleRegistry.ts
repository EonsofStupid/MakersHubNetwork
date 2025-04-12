
import { subscribeToAuthEvents } from '@/auth/bridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/shared/types/shared.types';

// Module state type
interface ModuleState {
  initialized: boolean;
  eventHandlersRegistered: boolean;
}

// Initialize module state
const moduleState: ModuleState = {
  initialized: false,
  eventHandlersRegistered: false,
};

/**
 * Initialize the admin module
 */
export function initializeAdminModule(): void {
  if (moduleState.initialized) {
    return;
  }

  const logger = getLogger();
  logger.info('Initializing admin module', {
    details: { 
      category: LogCategory.ADMIN,
      source: 'ModuleRegistry' 
    }
  });

  // Register event handlers if not already done
  if (!moduleState.eventHandlersRegistered) {
    registerEventHandlers();
    moduleState.eventHandlersRegistered = true;
  }

  moduleState.initialized = true;
}

/**
 * Register event handlers for admin module
 */
function registerEventHandlers(): void {
  const logger = getLogger();
  
  // Subscribe to auth events
  subscribeToAuthEvents((event) => {
    logger.info(`Admin module received auth event: ${event.type}`, {
      details: { 
        category: LogCategory.ADMIN,
        source: 'ModuleRegistry',
        eventType: event.type 
      }
    });

    // Handle auth events specific to admin functionality
    switch (event.type) {
      case 'AUTH_SIGNED_IN':
        // Handle sign in if needed
        break;
      case 'AUTH_SIGNED_OUT':
        // Handle sign out if needed
        break;
    }
  });
}
