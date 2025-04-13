
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

export type ChatBridgeMessage = {
  type: string;
  [key: string]: any;
};

// Updated to accept any string channel, including dynamic patterns like 'session:123'
export type ChatBridgeChannel = string;

export type ChatBridgeListener = (message: ChatBridgeMessage) => void;

/**
 * ChatBridge - Implements a centralized messaging system for the chat module
 * This prevents circular dependencies by creating a one-way communication flow
 */
class ChatBridgeImpl {
  private listeners: Map<ChatBridgeChannel, ChatBridgeListener[]> = new Map();
  
  /**
   * Subscribe to a channel
   * @param channel The channel to subscribe to
   * @param listener The listener callback
   * @returns Unsubscribe function
   */
  subscribe(channel: ChatBridgeChannel, listener: ChatBridgeListener): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    
    const channelListeners = this.listeners.get(channel)!;
    channelListeners.push(listener);
    
    logger.log(LogLevel.DEBUG, LogCategory.CHAT, `Listener added to ${channel} channel`, { 
      details: { listenersCount: channelListeners.length }
    });
    
    // Return unsubscribe function
    return () => {
      const index = channelListeners.indexOf(listener);
      if (index !== -1) {
        channelListeners.splice(index, 1);
        logger.log(LogLevel.DEBUG, LogCategory.CHAT, `Listener removed from ${channel} channel`, { 
          details: { listenersCount: channelListeners.length }
        });
      }
    };
  }
  
  /**
   * Publish a message to a channel
   * @param channel The channel to publish to
   * @param message The message to publish
   */
  publish(channel: ChatBridgeChannel, message: ChatBridgeMessage): void {
    if (!this.listeners.has(channel)) {
      return;
    }
    
    const channelListeners = this.listeners.get(channel)!;
    
    logger.log(LogLevel.DEBUG, LogCategory.CHAT, `Publishing to ${channel} channel`, {
      details: { message, listenersCount: channelListeners.length }
    });
    
    // Use setTimeout to break potential circular dependencies
    setTimeout(() => {
      channelListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          logger.log(LogLevel.ERROR, LogCategory.CHAT, `Error in ${channel} channel listener`, {
            details: { error, messageType: message.type }
          });
        }
      });
    }, 0);
  }
}

// Export singleton instance
export const chatBridge = new ChatBridgeImpl();
