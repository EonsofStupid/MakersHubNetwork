
// Re-export all bridge functionality
export { 
  AuthBridge,
  subscribeToAuthEvents,
  publishAuthEvent,
  initializeAuthBridge 
} from '@/bridges/AuthBridge';

export {
  ChatBridge,
  subscribeToChatEvents,
  publishChatEvent,
  initializeChatBridge
} from '@/bridges/ChatBridge';

export {
  LoggingBridge,
  subscribeToLoggingEvents,
  publishLoggingEvent,
  initializeLoggingBridge
} from '@/logging/bridge';
