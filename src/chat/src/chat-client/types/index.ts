
/**
 * All available chat modes in the MakersImpulse system
 */
export type ChatMode = 'chat' | 'ultra' | 'developer' | 'image' | 'debug' | 'planning' | 'training' | 'learn';

/**
 * Structure of a single chat message
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Structure of a conversation within the chat system
 */
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

/**
 * Core chat state management store interface
 */
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

/**
 * Printer context data structure
 */
export interface PrinterContext {
  name: string;
  settings: Record<string, unknown>;
}

/**
 * Project context data structure
 */
export interface ProjectContext {
  id: string;
  title: string;
}

/**
 * Bridge between chat and external systems
 */
export interface ChatBridge {
  userId: string;
  printerContext: PrinterContext;
  projectContext: ProjectContext;
}

/**
 * Logging level constants
 */
export const LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug',
} as const;

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

/**
 * Logging category constants
 */
export const LogCategory = {
  UI: 'ui',
  API: 'api',
  CHAT: 'chat',
  SYSTEM: 'system',
} as const;

export type LogCategoryType = typeof LogCategory[keyof typeof LogCategory];
