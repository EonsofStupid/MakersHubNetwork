
import { getLogger } from '@/logging';
import { LogCategory, LogOptions } from '@/logging/types';

export type ChatBridgeMessage = {
  type: string;
  [key: string]: any;
};

export type ChatBridgeChannel = 'system' | 'message' | 'admin' | 'events';

export type ChatBridgeListener = (message: ChatBridgeMessage) => void;

/**
 * ChatBridge - Implements a centralized messaging system for the chat module
 * This prevents circular dependencies by creating a one-way communication flow
 */
class ChatBridgeImpl {
  private listeners: Map<ChatBridgeChannel, ChatBridgeListener[]> = new Map();
  private logger = getLogger('ChatBridge', LogCategory.CHAT);
  
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
    
    this.logger.debug(`Listener added to ${channel} channel`, { 
      details: { listenersCount: channelListeners.length }
    } as LogOptions);
    
    // Return unsubscribe function
    return () => {
      const index = channelListeners.indexOf(listener);
      if (index > -1) {
        channelListeners.splice(index, 1);
        this.logger.debug(`Listener removed from ${channel} channel`, { 
          details: { listenersCount: channelListeners.length }
        } as LogOptions);
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
    
    this.logger.debug(`Publishing to ${channel} channel`, {
      details: { message, listenersCount: channelListeners.length }
    } as LogOptions);
    
    // Use setTimeout to break potential circular dependencies
    setTimeout(() => {
      channelListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          this.logger.error(`Error in ${channel} channel listener`, {
            details: { error, messageType: message.type },
            error: true
          } as LogOptions);
        }
      });
    }, 0);
  }
}

// Export singleton instance
export const chatBridge = new ChatBridgeImpl();
