
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

// Define LogOptions locally to avoid dependency issues
interface LogOptions {
  category?: string;
  details?: Record<string, any>;
  error?: boolean;
}

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
  private logger = getLogger();
  
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
      category: LogCategory.CHAT,
      details: { listenersCount: channelListeners.length }
    } as LogOptions);
    
    // Return unsubscribe function
    return () => {
      const index = channelListeners.indexOf(listener);
      if (index !== -1) {
        channelListeners.splice(index, 1);
        this.logger.debug(`Listener removed from ${channel} channel`, { 
          category: LogCategory.CHAT,
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
      category: LogCategory.CHAT,
      details: { message, listenersCount: channelListeners.length }
    } as LogOptions);
    
    // Use setTimeout to break potential circular dependencies
    setTimeout(() => {
      channelListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          this.logger.error(`Error in ${channel} channel listener`, {
            category: LogCategory.CHAT,
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
