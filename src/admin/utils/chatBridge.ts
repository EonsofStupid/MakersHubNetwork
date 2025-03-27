
/**
 * ChatBridge - Isolates admin communication channel
 * Provides a dedicated message bus for admin components to communicate
 */

type MessageHandler = (message: any) => void;
type MessageChannel = string;

class ChatBridge {
  private handlers: Map<MessageChannel, Set<MessageHandler>>;
  private readonly adminPrefix = 'makers-impulse-admin';
  
  constructor() {
    this.handlers = new Map();
  }
  
  /**
   * Subscribe to admin messages
   */
  subscribe(channel: MessageChannel, handler: MessageHandler): () => void {
    const channelKey = `${this.adminPrefix}:${channel}`;
    
    if (!this.handlers.has(channelKey)) {
      this.handlers.set(channelKey, new Set());
    }
    
    this.handlers.get(channelKey)?.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(channelKey);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(channelKey);
        }
      }
    };
  }
  
  /**
   * Publish message to admin channel
   */
  publish(channel: MessageChannel, message: any): void {
    const channelKey = `${this.adminPrefix}:${channel}`;
    const handlers = this.handlers.get(channelKey);
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in admin chat handler for ${channel}:`, error);
        }
      });
    }
  }
  
  /**
   * Create a dedicated channel with controlled scope
   */
  createChannel(name: string) {
    const channel = `${name}-${Date.now()}`;
    
    return {
      publish: (message: any) => this.publish(channel, message),
      subscribe: (handler: MessageHandler) => this.subscribe(channel, handler),
      name: channel
    };
  }
}

// Singleton instance
export const adminChatBridge = new ChatBridge();
