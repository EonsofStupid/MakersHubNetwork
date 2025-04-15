
export type ChatMode = 'chat' | 'ultra' | 'developer' | 'image' | 'debug' | 'planning' | 'training' | 'learn';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  created_at: string;
  updated_at: string;
  timestamp?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: ChatMode;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
  pinned?: boolean;
  favorite?: boolean;
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

export interface ChatSystemSettings {
  id: string;
  systemPrompt?: string;
  defaultModel?: string;
  maxContextLength: number;
  enableHistory: boolean;
  provider: string;
  created_at: string;
  updated_at: string;
}
