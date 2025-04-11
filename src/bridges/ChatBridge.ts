
import { ChatBridgeImplementation, ChatMessage, ChatSession, ChatSessionUpdates } from '@/chat/types/bridge.types';
import { nanoid } from 'nanoid';

/**
 * Event listeners for chat events
 */
const listeners: ((event: any) => void)[] = [];

/**
 * ChatBridge implementation for handling chat functionality
 */
export const chatBridge: ChatBridgeImplementation = {
  async createSession(options = {}) {
    const sessionId = nanoid();
    
    const session: ChatSession = {
      id: sessionId,
      title: options.title || 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      messages: []
    };
    
    return session;
  },
  
  async getSession(sessionId) {
    // Mock implementation
    console.log('[ChatBridge] Get session', sessionId);
    return {
      id: sessionId,
      title: 'Retrieved Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      messages: []
    };
  },
  
  async listSessions() {
    // Mock implementation
    console.log('[ChatBridge] List sessions');
    return [
      {
        id: 'session-1',
        title: 'Chat 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        messages: []
      },
      {
        id: 'session-2',
        title: 'Chat 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        messages: []
      }
    ];
  },
  
  async sendMessage(sessionId, content, role = 'user') {
    const messageId = nanoid();
    const timestamp = new Date();
    
    const message: ChatMessage = {
      id: messageId,
      sessionId,
      content,
      role,
      timestamp
    };
    
    // Publish message event
    publishChatEvent({
      type: 'MESSAGE_SENT',
      payload: message,
      sessionId
    });
    
    // Mock AI response
    setTimeout(() => {
      const responseId = nanoid();
      const responseMessage: ChatMessage = {
        id: responseId,
        sessionId,
        content: `Response to: ${content}`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      publishChatEvent({
        type: 'MESSAGE_RECEIVED',
        payload: responseMessage,
        sessionId
      });
    }, 1000);
    
    return message;
  },
  
  async updateSession(sessionId, updates) {
    // Mock implementation
    console.log('[ChatBridge] Update session', sessionId, updates);
    // Create a complete ChatSession object to return
    return {
      id: sessionId,
      title: updates.title || 'Updated Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: updates.status || 'active',
      messages: []
    };
  },
  
  async deleteSession(sessionId) {
    // Mock implementation
    console.log('[ChatBridge] Delete session', sessionId);
    return true;
  }
};

/**
 * Subscribe to chat events
 */
export function subscribeToChatEvents(listener: (event: any) => void) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Publish chat event to subscribers
 */
export function publishChatEvent(event: any) {
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('[ChatBridge] Error in chat event listener', error);
    }
  });
}
