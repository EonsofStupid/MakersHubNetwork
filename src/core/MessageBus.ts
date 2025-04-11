
/**
 * Core Message Bus Implementation
 * 
 * This is the foundation for all inter-module communication.
 * It enables strict boundaries between modules while allowing controlled
 * communication through predefined channels.
 */

export type MessageHandler = (message: any) => void;
export type MessageChannel = string;
export type UnsubscribeFn = () => void;

/**
 * Core MessageBus class
 * Facilitates controlled communication between isolated modules
 */
class MessageBus {
  private handlers: Map<MessageChannel, Set<MessageHandler>>;
  private channelPrefixes: Map<string, string>;
  private debugMode: boolean = false;
  
  constructor() {
    this.handlers = new Map();
    this.channelPrefixes = new Map();
    
    // Register standard modules
    this.registerPrefix('auth', 'auth');
    this.registerPrefix('admin', 'admin');
    this.registerPrefix('chat', 'chat');
    this.registerPrefix('app', 'app');
    this.registerPrefix('system', 'system');
    this.registerPrefix('logging', 'log');
  }
  
  /**
   * Enable debug mode to log all messages
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
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
    
    if (this.debugMode) {
      console.debug(`[MessageBus] Subscribed to ${fullChannel}`);
    }
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(fullChannel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(fullChannel);
        }
        
        if (this.debugMode) {
          console.debug(`[MessageBus] Unsubscribed from ${fullChannel}`);
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
    
    if (this.debugMode) {
      console.debug(`[MessageBus] Publishing to ${fullChannel}:`, message);
    }
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`[MessageBus] Error in message handler for ${fullChannel}:`, error);
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

// Export singleton instance
export const messageBus = new MessageBus();

// Export bridge creation helper
export function createModuleBridge(moduleName: string) {
  return messageBus.createInterface(moduleName);
}
