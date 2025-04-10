
/**
 * Internal implementation of the Chat Bridge for the chat module
 */
import { chatBridgeImpl } from '@/bridges/ChatBridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

// Re-export the bridge for use in the chat module
export const chatBridge = chatBridgeImpl;

// Re-export the types
export type { ChatEvent, ChatEventType, ChatMessage, ChatMessageType, ChatSessionOptions } from '@/bridges/ChatBridge';

// Provide utility functions specific to the chat module
export function createChatSession(userId?: string, mode: 'normal' | 'dev' | 'admin' = 'normal') {
  const logger = getLogger();
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  logger.debug('Creating new chat session', {
    category: LogCategory.CHAT,
    details: { sessionId, userId, mode }
  });
  
  chatBridge.publish('system', {
    type: 'session-created',
    sessionId,
    mode,
    userId
  });
  
  return sessionId;
}

