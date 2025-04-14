
/**
 * Chat system types
 */

// Chat mode
export type ChatMode = 'chat' | 'ultra' | 'developer' | 'image' | 'debug' | 'planning' | 'training' | 'learn' | 'normal' | 'dev';

// Chat message
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

// Chat conversation
export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: ChatMode;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  favorite?: boolean;
}

// Chat session
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// Chat store
export interface ChatStore {
  mode: ChatMode;
  messages: ChatMessage[];
  isLoading: boolean;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  
  setMode: (mode: ChatMode) => void;
  setIsLoading: (isLoading: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  createConversation: (mode?: ChatMode) => string;
  setActiveConversation: (id: string) => void;
  updateConversation?: (id: string, updates: Partial<ChatConversation>) => void;
  deleteConversation?: (id: string) => void;
  pinConversation?: (id: string, pinned: boolean) => void;
  favoriteConversation?: (id: string, favorite: boolean) => void;
}

// Printer context
export interface PrinterContext {
  name: string;
  settings: Record<string, unknown>;
}

// Project context
export interface ProjectContext {
  id: string;
  title: string;
}

// Chat bridge
export interface ChatBridge {
  userId: string;
  printerContext: PrinterContext;
  projectContext: ProjectContext;
}

// Chat context
export interface ChatContext {
  context: string;
  loadContext: (query: string) => Promise<string>;
  isLoadingContext: boolean;
  messages: any[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  mode: ChatMode;
}
