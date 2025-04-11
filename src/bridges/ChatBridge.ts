
import { User } from "@/shared/types";
import { authBridge } from "./AuthBridge";

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  status: 'active' | 'archived' | 'pending';
}

export interface ChatBridgeClass {
  getActiveSessions: () => ChatSession[];
  sendMessage: (sessionId: string, content: string) => Promise<ChatMessage>;
  createSession: (participants: string[]) => Promise<ChatSession>;
  archiveSession: (sessionId: string) => Promise<boolean>;
  subscribeToMessages: (sessionId: string, callback: (message: ChatMessage) => void) => () => void;
}

class ChatBridgeImplementation implements ChatBridgeClass {
  private sessions: ChatSession[] = [];
  private messageListeners: Record<string, ((message: ChatMessage) => void)[]> = {};

  constructor() {
    // Initialize with empty sessions
    this.sessions = [];
  }

  getActiveSessions() {
    return this.sessions.filter(session => session.status === 'active');
  }

  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    const user = authBridge.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to send messages');
    }
    
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const message: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      content,
      sender: {
        id: user.id,
        name: user.displayName || 'Unknown User',
        avatar: user.avatarUrl
      },
      timestamp: new Date()
    };

    session.messages.push(message);
    
    // Notify listeners
    if (this.messageListeners[sessionId]) {
      this.messageListeners[sessionId].forEach(listener => listener(message));
    }
    
    return message;
  }

  async createSession(participantIds: string[]): Promise<ChatSession> {
    const user = authBridge.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create sessions');
    }

    // Generate a simple session
    const session: ChatSession = {
      id: Math.random().toString(36).substring(7),
      messages: [],
      participants: [
        {
          id: user.id,
          name: user.displayName || 'Unknown User',
          avatar: user.avatarUrl
        },
        // Mock additional participants
        ...participantIds.map(id => ({
          id,
          name: `User ${id}`,
        }))
      ],
      status: 'active'
    };

    this.sessions.push(session);
    return session;
  }

  async archiveSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) {
      return false;
    }
    
    session.status = 'archived';
    return true;
  }

  subscribeToMessages(sessionId: string, callback: (message: ChatMessage) => void): () => void {
    if (!this.messageListeners[sessionId]) {
      this.messageListeners[sessionId] = [];
    }
    
    this.messageListeners[sessionId].push(callback);
    
    // Return unsubscribe function
    return () => {
      if (this.messageListeners[sessionId]) {
        this.messageListeners[sessionId] = this.messageListeners[sessionId].filter(
          listener => listener !== callback
        );
      }
    };
  }
}

// Export a singleton instance
export const chatBridge = new ChatBridgeImplementation();

// For backwards compatibility
export const chatBridgeImpl = chatBridge;
export const ChatBridge = chatBridge;
