
export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived' | 'deleted';
  messages: ChatMessage[];
}

export interface ChatSessionOptions {
  title?: string;
}

export interface ChatSessionUpdates {
  title?: string;
  status?: 'active' | 'archived' | 'deleted';
}

export type ChatEventType = 
  | 'SESSION_CREATED'
  | 'SESSION_UPDATED'
  | 'SESSION_DELETED'
  | 'MESSAGE_SENT'
  | 'MESSAGE_RECEIVED';

export interface ChatEvent {
  type: ChatEventType;
  payload: any;
  sessionId: string;
}

export interface ChatBridgeImplementation {
  createSession(options?: ChatSessionOptions): Promise<ChatSession>;
  getSession(sessionId: string): Promise<ChatSession>;
  listSessions(): Promise<ChatSession[]>;
  sendMessage(sessionId: string, content: string, role?: 'user' | 'assistant' | 'system'): Promise<ChatMessage>;
  updateSession(sessionId: string, updates: ChatSessionUpdates): Promise<ChatSession>;
  deleteSession(sessionId: string): Promise<boolean>;
}

export interface ChatBridge {
  chatBridge: ChatBridgeImplementation;
}
