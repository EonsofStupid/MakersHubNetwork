
import { authBridge } from './AuthBridge';

/**
 * ChatEvent types for inter-module communication
 */
export type ChatEventType = 
  | 'CHAT_INITIALIZED'
  | 'CHAT_OPENED'
  | 'CHAT_CLOSED'
  | 'MESSAGE_SENT'
  | 'MESSAGE_RECEIVED'
  | 'CONVERSATION_UPDATED'
  | 'ERROR';

/**
 * ChatEvent interface
 */
export interface ChatEvent {
  type: ChatEventType;
  payload?: any;
}

/**
 * ChatEventHandler function type
 */
export type ChatEventHandler = (event: ChatEvent) => void;

/**
 * ChatBridge - Communication bridge for chat-related events
 * Allows modules to communicate without direct dependencies
 */
class ChatBridgeClass {
  private eventHandlers: ChatEventHandler[] = [];
  private initialized = false;

  /**
   * Initialize the chat system
   */
  initialize(): void {
    if (this.initialized) return;
    
    this.initialized = true;
    this.publishChatEvent({ type: 'CHAT_INITIALIZED' });
  }

  /**
   * Subscribe to chat events
   * @param handler The event handler function
   * @returns Unsubscribe function
   */
  subscribeToChatEvents(handler: ChatEventHandler): () => void {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Publish chat events to all subscribers
   * @param event The chat event to publish
   */
  publishChatEvent(event: ChatEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in chat event handler:', error);
      }
    });
  }

  /**
   * Send a message
   * @param message The message to send
   */
  sendMessage(message: string): void {
    // Check authentication
    if (!authBridge.isAuthenticated()) {
      this.publishChatEvent({ 
        type: 'ERROR', 
        payload: { message: 'Authentication required to send messages' } 
      });
      return;
    }

    const userId = authBridge.getUserId();
    
    // Publish message event
    this.publishChatEvent({
      type: 'MESSAGE_SENT',
      payload: {
        id: Date.now().toString(),
        content: message,
        userId,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Open the chat interface
   */
  openChat(): void {
    this.publishChatEvent({ type: 'CHAT_OPENED' });
  }

  /**
   * Close the chat interface
   */
  closeChat(): void {
    this.publishChatEvent({ type: 'CHAT_CLOSED' });
  }
}

// Export a singleton instance
export const chatBridge = new ChatBridgeClass();
