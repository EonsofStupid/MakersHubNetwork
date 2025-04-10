
/**
 * ChatBridge.ts
 * 
 * Bridge for chat-related functionality
 * Isolates chat module and provides an interface for other modules
 */

import { messageBus } from './MessageBus';
import { useAuthStore } from '@/auth/store/auth.store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Chat event types
export type ChatEventType = 
  | 'CHAT_MESSAGE_SENT'
  | 'CHAT_MESSAGE_RECEIVED'
  | 'CHAT_OPENED'
  | 'CHAT_CLOSED'
  | 'CHAT_CONNECTED'
  | 'CHAT_DISCONNECTED'
  | 'CHAT_ERROR';

// Chat context type
export interface ChatContext {
  userId?: string;
  printerContext?: Record<string, any>;
  projectContext?: Record<string, any>;
}

// Create chat messaging interface
const chatMessaging = messageBus.createInterface('chat');

// ChatBridge singleton - Central contract for chat operations
export const ChatBridge = {
  /**
   * Send a chat message
   */
  sendMessage: (message: string, context?: ChatContext) => {
    const logger = getLogger();
    
    try {
      logger.info('Sending chat message', { 
        category: LogCategory.CHAT,
        source: 'ChatBridge'
      });
      
      // Get current user ID if available
      const user = useAuthStore.getState().user;
      const userId = user?.id;
      
      // Add user context if available
      const messageContext = {
        ...context,
        userId: userId || context?.userId,
      };
      
      // Publish message event
      chatMessaging.publish('message:sent', { 
        message, 
        context: messageContext,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      logger.error('Error sending chat message', { 
        category: LogCategory.CHAT,
        source: 'ChatBridge',
        details: { error }
      });
      
      return false;
    }
  },
  
  /**
   * Listen for chat messages
   */
  onMessage: (handler: (message: any) => void) => {
    return chatMessaging.subscribe('message:received', handler);
  },
  
  /**
   * Open the chat interface
   */
  openChat: () => {
    chatMessaging.publish('ui:open', {});
  },
  
  /**
   * Close the chat interface
   */
  closeChat: () => {
    chatMessaging.publish('ui:close', {});
  },
  
  /**
   * Listen for chat open/close events
   */
  onChatToggle: (handler: (isOpen: boolean) => void) => {
    const openSub = chatMessaging.subscribe('ui:open', () => handler(true));
    const closeSub = chatMessaging.subscribe('ui:close', () => handler(false));
    
    // Return combined unsubscribe function
    return () => {
      openSub();
      closeSub();
    };
  }
};

// Initialize chat bridge
export const initializeChatBridge = (): void => {
  const logger = getLogger();
  logger.info('Initializing chat bridge', {
    category: LogCategory.CHAT,
    source: 'ChatBridge'
  });
  
  // Any additional initialization can be added here
};
