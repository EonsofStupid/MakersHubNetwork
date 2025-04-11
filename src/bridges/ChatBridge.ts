
export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  session_id: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  members: string[];
  status: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}

export type ChatEventType = 
  | 'MESSAGE_SENT' 
  | 'MESSAGE_RECEIVED'
  | 'SESSION_CREATED'
  | 'SESSION_UPDATED'
  | 'SESSION_DELETED'
  | 'USER_JOINED'
  | 'USER_LEFT';

export interface ChatEvent {
  type: ChatEventType;
  payload: any;
}

export interface ChatSessionOptions {
  members?: string[];
  metadata?: Record<string, any>;
}

export interface ChatBridgeImplementation {
  createSession: (title: string, options?: ChatSessionOptions) => Promise<ChatSession>;
  getSession: (sessionId: string) => Promise<ChatSession>;
  listSessions: () => Promise<ChatSession[]>;
  sendMessage: (sessionId: string, content: string, metadata?: Record<string, any>) => Promise<ChatMessage>;
  getMessages: (sessionId: string) => Promise<ChatMessage[]>;
  subscribe: (event: ChatEventType, callback: (data: any) => void) => () => void;
  subscribeToSession: (sessionId: string, callback: (message: ChatMessage) => void) => () => void;
  publish: (event: ChatEventType, data: any) => void;
}

export const ChatBridge: ChatBridgeImplementation = {
  createSession: async () => ({ id: '', title: '', created_at: '', updated_at: '', members: [], status: 'active' }),
  getSession: async () => ({ id: '', title: '', created_at: '', updated_at: '', members: [], status: 'active' }),
  listSessions: async () => [],
  sendMessage: async () => ({ id: '', content: '', sender_id: '', session_id: '', created_at: '' }),
  getMessages: async () => [],
  subscribe: () => () => {},
  subscribeToSession: () => () => {},
  publish: () => {},
};

// Export for use in application
export const chatBridge = ChatBridge;
