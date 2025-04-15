
export type ChatMode = 'chat' | 'ultra' | 'developer' | 'image' | 'debug' | 'planning' | 'training' | 'learn';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: ChatMode;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  favorite?: boolean;
  created_at: string;
  updated_at: string;
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
