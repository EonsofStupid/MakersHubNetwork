
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
    
    this.handlers.get(fullChannel)!.add(handler);
    
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
   * Publish a message to a channel
   */
  publish(module: string, channel: string, message: any): void {
    const fullChannel = this.getChannelName(module, channel);
    
    const handlers = this.handlers.get(fullChannel);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in message handler for channel ${fullChannel}:`, error);
        }
      });
    }
  }
  
  /**
   * Clear all handlers for a module
   */
  clearModule(module: string): void {
    const prefix = this.channelPrefixes.get(module) || module;
    
    this.handlers.forEach((_, channel) => {
      if (channel.startsWith(`${prefix}:`)) {
        this.handlers.delete(channel);
      }
    });
  }
}

/**
 * Export singleton instance of MessageBus
 */
export const messageBus = new MessageBus();

/**
 * Create a module-specific bridge
 * @param module Module name
 * @returns Module bridge
 */
export function createModuleBridge(module: string) {
  return {
    /**
     * Subscribe to messages on a channel
     * @param channel Channel to subscribe to
     * @param handler Message handler
     * @returns Unsubscribe function
     */
    subscribe(channel: string, handler: MessageHandler): UnsubscribeFn {
      return messageBus.subscribe(module, channel, handler);
    },
    
    /**
     * Publish a message to a channel
     * @param channel Channel to publish to
     * @param message Message to publish
     */
    publish(channel: string, message: any): void {
      messageBus.publish(module, channel, message);
    }
  };
}
