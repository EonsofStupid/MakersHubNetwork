
// Chat message type
export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
  metadata?: Record<string, any>;
}

// Chat session type
export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  metadata?: Record<string, any>;
}

// Chat session options
export interface ChatSessionOptions {
  title?: string;
  metadata?: Record<string, any>;
}

// Chat event types
export type ChatEventType = 
  | 'MESSAGE_ADDED'
  | 'SESSION_CREATED'
  | 'SESSION_UPDATED'
  | 'SESSION_DELETED';

// Chat event
export interface ChatEvent {
  type: ChatEventType;
  sessionId: string;
  data?: any;
}

// Chat event listener
export type ChatEventListener = (event: ChatEvent) => void;

// Basic Chat Bridge Implementation
class ChatBridgeImplementation {
  private isInitialized = false;
  private sessions: Map<string, ChatSession> = new Map();
  private eventListeners: ChatEventListener[] = [];
  
  // Initialize the chat bridge
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('Chat Bridge initialized');
  }
  
  // Subscribe to chat events
  subscribeToSession(sessionId: string, listener: ChatEventListener): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }
  
  // Publish chat events
  private publishEvent(event: ChatEvent): void {
    this.eventListeners.forEach(listener => {
      listener(event);
    });
  }
  
  // Create a new session
  async createSession(options?: ChatSessionOptions): Promise<ChatSession> {
    const id = Math.random().toString(36).substring(2, 15);
    const session: ChatSession = {
      id,
      title: options?.title || `Chat ${new Date().toLocaleString()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      metadata: options?.metadata
    };
    
    this.sessions.set(id, session);
    
    this.publishEvent({
      type: 'SESSION_CREATED',
      sessionId: id,
      data: session
    });
    
    return session;
  }
  
  // Get a session by ID
  getSession(id: string): ChatSession | undefined {
    return this.sessions.get(id);
  }
  
  // Get all sessions
  listSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }
  
  // Send a message
  async sendMessage(sessionId: string, content: string, role: 'user' | 'assistant' | 'system' = 'user'): Promise<ChatMessage> {
    if (!this.sessions.has(sessionId)) {
      await this.createSession({ title: 'New Chat' });
    }
    
    const session = this.sessions.get(sessionId)!;
    
    const message: ChatMessage = {
      id: Math.random().toString(36).substring(2, 15),
      sessionId,
      content,
      role,
      timestamp: Date.now(),
    };
    
    session.messages.push(message);
    session.updatedAt = Date.now();
    
    this.publishEvent({
      type: 'MESSAGE_ADDED',
      sessionId,
      data: message
    });
    
    return message;
  }
  
  // Get messages for a session
  getMessages(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }
}

// Create and export a singleton instance
export const chatBridge = new ChatBridgeImplementation();

// For compatibility with existing code
export const ChatBridge = chatBridge;
