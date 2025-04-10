
import { chatBridge as chatBridgeImpl } from '@/chat/lib/ChatBridge';
import { LogCategory } from '@/logging';
import { getLogger } from '@/logging';

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
  subscribeToSession: (sessionId: string, callback: (message: any) => void) => {
    return chatBridgeImpl.subscribe(`session:${sessionId}`, callback);
  },
  
  /**
   * Create a new chat session
   */
  createSession: (userId?: string, mode: 'normal' | 'dev' | 'admin' = 'normal') => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    chatBridgeImpl.publish('system', {
      type: 'session-created',
      sessionId,
      mode,
      userId
    });
    
    return sessionId;
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
 * Export ChatBridge functionality
 */
export function subscribeToChatEvents(channel: string, listener: (message: any) => void) {
  return chatBridgeImpl.subscribe(channel, listener);
}

export function publishChatEvent(channel: string, message: any) {
  chatBridgeImpl.publish(channel, message);
}
