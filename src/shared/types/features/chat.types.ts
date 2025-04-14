
/**
 * Chat system types
 */
import { BaseEntity } from '../core/common.types';

export type ChatMode = 'chat' | 'ultra' | 'developer' | 'image' | 'debug' | 'planning' | 'training' | 'learn';

export interface ChatMessage extends BaseEntity {
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  session_id?: string;
}

export interface ChatSession extends BaseEntity {
  title: string;
  messages: ChatMessage[];
  mode: ChatMode;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  favorite?: boolean;
  user_id?: string;
  is_active?: boolean;
  system_user_id?: string;
}

export interface ChatStore {
  mode: ChatMode;
  messages: ChatMessage[];
  isLoading: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
  
  setMode: (mode: ChatMode) => void;
  setIsLoading: (isLoading: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  createSession: (title?: string) => string;
  setCurrentSessionId: (id: string) => void;
  updateSession?: (id: string, updates: Partial<ChatSession>) => void;
  deleteSession?: (id: string) => void;
  pinSession?: (id: string, pinned: boolean) => void;
  favoriteSession?: (id: string, favorite: boolean) => void;
  getCurrentSession: () => ChatSession | null;
  saveMessage: (message: Omit<ChatMessage, 'id'>) => ChatMessage | null;
  sendMessage?: (content: string) => Promise<void>;
  isChatEnabled?: boolean;
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
