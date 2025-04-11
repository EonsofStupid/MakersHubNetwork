
// Define chat event types
export type ChatEventType = 
  | 'CHAT_MESSAGE_RECEIVED'
  | 'CHAT_SESSION_STARTED'
  | 'CHAT_SESSION_ENDED'
  | 'CHAT_SESSION_UPDATED'
  | 'CHAT_TYPING_STARTED'
  | 'CHAT_TYPING_ENDED';

export type ChatEvent = {
  type: ChatEventType;
  payload?: any;
};

export type ChatEventHandler = (event: ChatEvent) => void;

// Chat bridge interface
export interface ChatBridgeImplementation {
  sendMessage: (message: string) => Promise<void>;
  getHistory: () => any[];
  clearHistory: () => void;
  startSession: () => void;
  endSession: () => void;
  subscribe: (handler: ChatEventHandler) => () => void;
  publish: (event: ChatEvent) => void;
}

// Simple implementation
class ChatBridgeClass implements ChatBridgeImplementation {
  private history: any[] = [];
  private eventHandlers: ChatEventHandler[] = [];
  private sessionActive: boolean = false;

  sendMessage(message: string) {
    console.log('ChatBridge: sendMessage called', { message });
    const messageObj = {
      id: `msg-${Date.now()}`,
      content: message,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };
    
    this.history.push(messageObj);
    this.publish({
      type: 'CHAT_MESSAGE_RECEIVED',
      payload: { message: messageObj }
    });
    
    return Promise.resolve();
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }

  startSession() {
    this.sessionActive = true;
    this.publish({
      type: 'CHAT_SESSION_STARTED',
      payload: { timestamp: new Date().toISOString() }
    });
  }

  endSession() {
    this.sessionActive = false;
    this.publish({
      type: 'CHAT_SESSION_ENDED',
      payload: { timestamp: new Date().toISOString() }
    });
  }

  subscribe(handler: ChatEventHandler) {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }

  publish(event: ChatEvent) {
    this.eventHandlers.forEach(handler => handler(event));
  }
}

// Create singleton instance
export const chatBridge: ChatBridgeImplementation = new ChatBridgeClass();

// Export event subscription and publishing functions
export const subscribeToChatEvents = (handler: ChatEventHandler) => {
  return chatBridge.subscribe(handler);
};

export const publishChatEvent = (event: ChatEvent) => {
  chatBridge.publish(event);
};
