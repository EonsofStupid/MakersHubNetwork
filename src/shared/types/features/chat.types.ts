
/**
 * Chat system types
 */

export type ChatMode = 'chat' | 'ultra' | 'developer' | 'image' | 'debug' | 'planning' | 'training' | 'learn';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode?: ChatMode;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ChatStore {
  mode: ChatMode;
  messages: ChatMessage[];
  isLoading: boolean;
  isChatEnabled: boolean;
  sendMessage: (content: string) => Promise<void>;
  conversations: ChatSession[];
  activeConversationId: string | null;
  
  setMode: (mode: ChatMode) => void;
  setIsLoading: (isLoading: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  createConversation: (mode?: ChatMode) => string;
  setActiveConversation: (id: string) => void;
  updateConversation?: (id: string, updates: Partial<ChatSession>) => void;
  deleteConversation?: (id: string) => void;
  pinConversation?: (id: string, pinned: boolean) => void;
  favoriteConversation?: (id: string, favorite: boolean) => void;
}

export interface PrinterContext {
  name: string;
  settings: Record<string, unknown>;
}

export interface ProjectContext {
  id: string;
  title: string;
}

export interface ChatBridge {
  userId: string;
  printerContext: PrinterContext;
  projectContext: ProjectContext;
}
