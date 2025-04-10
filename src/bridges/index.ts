
/**
 * bridges/index.ts
 * 
 * Central export point for all bridges.
 * This file helps avoid circular dependencies by providing a single source of truth.
 */

// Export Auth bridge
export { 
  AuthBridge,
  subscribeToAuthEvents,
  publishAuthEvent,
  initializeAuthBridge 
} from '@/bridges/AuthBridge';

// Export Chat bridge
export {
  ChatBridge,
  subscribeToChatEvents,
  publishChatEvent,
  initializeChatBridge
} from '@/bridges/ChatBridge';

// Export Logging bridge
export {
  LoggingBridge,
  subscribeToLoggingEvents,
  publishLoggingEvent,
  initializeLoggingBridge
} from '@/logging/bridge';

// Export the core message bus
export {
  messageBus,
  createModuleBridge
} from '@/core/MessageBus';

