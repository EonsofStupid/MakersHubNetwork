
import { subscribeToAuthEvents } from '@/auth/bridge';
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';

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
    category: LogCategory.ADMIN,
    source: 'ModuleRegistry'
  } as LogOptions);

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
      category: LogCategory.ADMIN,
      source: 'ModuleRegistry',
      details: { 
        eventType: event.type 
      }
    } as LogOptions);

    // Handle auth events specific to admin functionality
    switch (event.type) {
      case 'SIGNED_IN':
      case 'AUTH_SIGNED_IN':
        // Handle sign in if needed
        break;
      case 'SIGNED_OUT':
      case 'AUTH_SIGNED_OUT':
        // Handle sign out if needed
        break;
    }
  });
}
