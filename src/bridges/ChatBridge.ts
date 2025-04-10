
/**
 * ChatBridge.ts
 * 
 * Bridge for the Chat module - provides a clean interface for other modules to
 * interact with the Chat module without direct dependencies.
 */

import { createModuleBridge } from '@/core/MessageBus';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Create a module-specific bridge
const chatBridgeImpl = createModuleBridge('chat');

// Define types for chat messages and events
export type ChatEventType = 
  | 'message'
  | 'notification'
  | 'system'
  | 'session';

export type ChatMessageType =
  | 'text'
  | 'image'
  | 'file'
  | 'system';

export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  sessionId?: string;
  type?: ChatMessageType;
  metadata?: Record<string, any>;
};

export type ChatEvent = {
  type: string;
  message?: ChatMessage;
  sessionId?: string;
  [key: string]: any;
};

export type ChatSessionOptions = {
  userId?: string;
  mode?: 'normal' | 'dev' | 'admin';
  metadata?: Record<string, any>;
};

/**
 * ChatBridge - Public API for the Chat module
 * 
 * This bridge provides a clean interface for other modules to interact with 
 * the Chat module without direct dependencies.
 */
export const ChatBridge = {
  /**
   * Send a message to a chat session
   */
  sendMessage: (sessionId: string, content: string, metadata: Record<string, any> = {}) => {
    chatBridgeImpl.publish('message', {
      type: 'send-message',
      message: {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sessionId,
        metadata
      },
      sessionId
    });
  },
  
  /**
   * Subscribe to chat events for a specific session
   */
  subscribeToSession: (sessionId: string, callback: (event: ChatEvent) => void) => {
    return chatBridgeImpl.subscribe(`session:${sessionId}`, callback);
  },
  
  /**
   * Create a new chat session
   */
  createSession: (options: ChatSessionOptions = {}) => {
    const { userId, mode = 'normal', metadata = {} } = options;
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    chatBridgeImpl.publish('system', {
      type: 'session-created',
      sessionId,
      mode,
      userId,
      metadata
    });
    
    return sessionId;
  },
  
  /**
   * Close a chat session
   */
  closeSession: (sessionId: string) => {
    chatBridgeImpl.publish(`session:${sessionId}`, {
      type: 'session-closed',
      sessionId
    });
  },
  
  /**
   * Subscribe to all messages from the chat system
   */
  subscribeToChannel: (channel: ChatEventType, callback: (event: ChatEvent) => void) => {
    return chatBridgeImpl.subscribe(channel, callback);
  },
  
  /**
   * Publish an event to a chat channel
   */
  publishEvent: (channel: ChatEventType, event: ChatEvent) => {
    chatBridgeImpl.publish(channel, event);
  }
};

/**
 * Initialize the Chat bridge
 */
export function initializeChatBridge() {
  const logger = getLogger();
  
  logger.info('Initializing ChatBridge', {
    category: LogCategory.SYSTEM,
    source: 'ChatBridge'
  });
  
  // Subscribe to system events
  chatBridgeImpl.subscribe('system', (message) => {
    if (message.type === 'session-created') {
      logger.debug('Chat session created', {
        category: LogCategory.CHAT,
        details: { sessionId: message.sessionId, mode: message.mode }
      });
    }
  });
  
  return true;
}

/**
 * Export ChatBridge functionality for direct use
 */
export function subscribeToChatEvents(channel: string, listener: (message: any) => void) {
  return chatBridgeImpl.subscribe(channel, listener);
}

export function publishChatEvent(channel: string, message: any) {
  chatBridgeImpl.publish(channel, message);
}

// Export the internal bridge for chat module use only
export { chatBridgeImpl };

