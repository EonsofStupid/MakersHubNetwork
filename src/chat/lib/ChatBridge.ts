
/**
 * Internal implementation of the Chat Bridge for the chat module
 * 
 * This is the boundary layer between the chat module and the rest of the application
 */
import { chatBridgeImpl } from '@/bridges/ChatBridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { AuthBridge } from '@/bridges/AuthBridge';

// Re-export the bridge for use in the chat module
export const chatBridge = chatBridgeImpl;

// Re-export the types
export type { 
  ChatEvent, 
  ChatEventType, 
  ChatMessage, 
  ChatMessageType, 
  ChatSessionOptions 
} from '@/bridges/ChatBridge';

// Provide utility functions specific to the chat module
export function createChatSession(userId?: string, mode: 'normal' | 'dev' | 'admin' = 'normal') {
  const logger = getLogger();
  
  // Generate a unique session ID 
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  // Use userId from AuthBridge if not provided
  const effectiveUserId = userId || (AuthBridge.isAuthenticated() ? 
    (AuthBridge as any).currentUser?.id : undefined);
  
  logger.debug('Creating new chat session', {
    category: LogCategory.CHAT,
    details: { sessionId, userId: effectiveUserId, mode }
  });
  
  // Publish event using the bridge
  chatBridge.publish('system', {
    type: 'session-created',
    sessionId,
    mode,
    userId: effectiveUserId
  });
  
  return sessionId;
}

// Subscribe to chat events safely
export function subscribeToChatChannel(channel: string, handler: (event: any) => void) {
  return chatBridge.subscribe(channel, handler);
}

// Publish chat events safely
export function publishToChatChannel(channel: string, event: any) {
  chatBridge.publish(channel, event);
}
