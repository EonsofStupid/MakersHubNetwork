
/**
 * ChatBridge - Core chat communication bridge
 * Provides a central point for chat events and operations
 */

// Define types
export type ChatEventType = 
  | 'message'
  | 'session-created'
  | 'typing'
  | 'read'
  | 'user-joined'
  | 'user-left'
  | 'error';

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  type: ChatMessageType;
}

export type ChatMessageType = 'text' | 'image' | 'file' | 'system';

export interface ChatEvent {
  type: ChatEventType;
  sessionId?: string;
  message?: ChatMessage;
  userId?: string;
  mode?: 'normal' | 'dev' | 'admin';
  timestamp?: string;
  error?: string;
}

export interface ChatSessionOptions {
  mode: 'normal' | 'dev' | 'admin';
  userId?: string;
}

// Define the ChatBridge class
class ChatBridgeClass {
  private eventHandlers: Map<string, Set<(event: ChatEvent) => void>> = new Map();
  
  // Subscribe to a channel
  subscribe(channel: string, handler: (event: ChatEvent) => void): () => void {
    if (!this.eventHandlers.has(channel)) {
      this.eventHandlers.set(channel, new Set());
    }
    
    const handlers = this.eventHandlers.get(channel)!;
    handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(channel);
      }
    };
  }
  
  // Publish to a channel
  publish(channel: string, event: ChatEvent): void {
    const handlers = this.eventHandlers.get(channel);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }
  
  // Send a message to a chat session
  sendMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): string {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const fullMessage: ChatMessage = {
      ...message,
      id,
      timestamp
    };
    
    this.publish(sessionId, {
      type: 'message',
      sessionId,
      message: fullMessage,
      timestamp
    });
    
    return id;
  }
  
  // Create a new chat session
  createSession(options: ChatSessionOptions): string {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    this.publish('system', {
      type: 'session-created',
      sessionId,
      userId: options.userId,
      mode: options.mode,
      timestamp: new Date().toISOString()
    });
    
    return sessionId;
  }
}

// Create and export a singleton instance
export const chatBridge = new ChatBridgeClass();
