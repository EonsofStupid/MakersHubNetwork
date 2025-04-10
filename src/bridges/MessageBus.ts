
/**
 * MessageBus.ts
 * 
 * Core message bus implementation for inter-module communication
 * Provides a central pub/sub mechanism for the entire application
 */

export type MessageHandler = (message: any) => void;
export type MessageChannel = string;
export type UnsubscribeFn = () => void;

/**
 * MessageBus singleton
 * Facilitates communication between isolated modules
 */
class MessageBus {
  private handlers: Map<MessageChannel, Set<MessageHandler>>;
  private channelPrefixes: Map<string, string>;
  
  constructor() {
    this.handlers = new Map();
    this.channelPrefixes = new Map();
  }
  
  /**
   * Register a module prefix to namespace its channels
   */
  registerPrefix(module: string, prefix: string): void {
    this.channelPrefixes.set(module, prefix);
  }
  
  /**
   * Get full channel name with prefix
   */
  private getChannelName(module: string, channel: string): string {
    const prefix = this.channelPrefixes.get(module) || module;
    return `${prefix}:${channel}`;
  }
  
  /**
   * Subscribe to messages on a specific channel
   */
  subscribe(module: string, channel: string, handler: MessageHandler): UnsubscribeFn {
    const fullChannel = this.getChannelName(module, channel);
    
    if (!this.handlers.has(fullChannel)) {
      this.handlers.set(fullChannel, new Set());
    }
    
    this.handlers.get(fullChannel)?.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(fullChannel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(fullChannel);
        }
      }
    };
  }
  
  /**
   * Publish message to a specific channel
   */
  publish(module: string, channel: string, message: any): void {
    const fullChannel = this.getChannelName(module, channel);
    const handlers = this.handlers.get(fullChannel);
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in message handler for ${fullChannel}:`, error);
        }
      });
    }
  }
  
  /**
   * Create a module-specific messaging interface
   */
  createInterface(module: string) {
    return {
      publish: (channel: string, message: any) => this.publish(module, channel, message),
      subscribe: (channel: string, handler: MessageHandler) => this.subscribe(module, channel, handler),
      module
    };
  }
}

// Singleton instance
export const messageBus = new MessageBus();

// Initialize standard modules
messageBus.registerPrefix('auth', 'auth');
messageBus.registerPrefix('admin', 'admin');
messageBus.registerPrefix('chat', 'chat');
messageBus.registerPrefix('app', 'app');
