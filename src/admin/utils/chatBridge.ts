
/**
 * Admin Module Bridge
 * 
 * This file is deprecated. Use adminBridge from ModuleRegistry instead.
 * 
 * This file will be removed in a future update.
 */
import { adminBridge } from '../ModuleRegistry';

// Export adminBridge as adminChatBridge for backward compatibility
export const adminChatBridge = adminBridge;

// Display deprecation warning 
console.warn('[DEPRECATED] admin/utils/chatBridge.ts is deprecated. Use adminBridge from ModuleRegistry instead.');

