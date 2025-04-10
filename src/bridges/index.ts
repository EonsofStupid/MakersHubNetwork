
/**
 * bridges/index.ts
 * 
 * Central export point for all application bridges
 * This helps maintain a clean dependency graph
 */

// Export message bus core
export { messageBus, type MessageHandler, type MessageChannel, type UnsubscribeFn } from './MessageBus';

// Export auth bridge
export { AuthBridge, subscribeToAuthEvents, publishAuthEvent, initializeAuthBridge } from './AuthBridge';

// Export chat bridge
export { ChatBridge, initializeChatBridge, type ChatContext, type ChatEventType } from './ChatBridge';
