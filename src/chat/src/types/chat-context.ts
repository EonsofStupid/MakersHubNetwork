
export type ChatMode = 'normal' | 'dev' | 'debug' | 'training';

export interface ChatContext {
  context: string;
  loadContext: (query: string) => Promise<string>;
  isLoadingContext: boolean;
  messages: any[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  mode: ChatMode; // Changed from optional to required property
}
