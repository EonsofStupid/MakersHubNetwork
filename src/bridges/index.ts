
export { 
  authBridge, 
  subscribeToAuthEvents, 
  publishAuthEvent,
  type AuthEvent,
  type AuthEventType,
  type AuthEventHandler,
  type AuthBridgeImplementation
} from './AuthBridge';

export {
  chatBridge,
  subscribeToChatEvents,
  publishChatEvent,
  type ChatEvent,
  type ChatEventType,
  type ChatEventHandler,
  type ChatBridgeImplementation
} from './ChatBridge';

// Export other bridges as they're created
