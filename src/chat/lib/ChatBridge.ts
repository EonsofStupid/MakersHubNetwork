
/**
 * ChatBridge - Communication channel for chat functionality
 * Isolates communication between modules and provides registry-based access
 */

type MessageHandler = (message: any) => void;
type MessageChannel = string;

class ChatBridge {
  private handlers: Map<MessageChannel, Set<MessageHandler>>;
  private readonly prefix = 'makers-impulse-chat';
  private static instance: ChatBridge;
  
  private constructor() {
    this.handlers = new Map();
  }
  
  public static getInstance(): ChatBridge {
    if (!ChatBridge.instance) {
      ChatBridge.instance = new ChatBridge();
    }
    return ChatBridge.instance;
  }
  
  /**
   * Subscribe to chat messages
   * @returns Unsubscribe function
   */
  subscribe(channel: MessageChannel, handler: MessageHandler): () => void {
    const channelKey = `${this.prefix}:${channel}`;
    
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
   * Publish message to channel
   */
  publish(channel: MessageChannel, message: any): void {
    const channelKey = `${this.prefix}:${channel}`;
    const handlers = this.handlers.get(channelKey);
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in chat handler for ${channel}:`, error);
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

// Export singleton instance
export const chatBridge = ChatBridge.getInstance();

// Create hook for using the chat bridge
import { useEffect, useState } from 'react';

export function useChatBridge(channel: string, initialHandler?: MessageHandler) {
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    if (!initialHandler) return;
    
    // Subscribe to the channel
    const unsubscribe = chatBridge.subscribe(channel, initialHandler);
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [channel, initialHandler]);
  
  // Helper to publish messages
  const publish = (message: any) => {
    chatBridge.publish(channel, message);
  };
  
  return {
    publish,
    messages
  };
}
