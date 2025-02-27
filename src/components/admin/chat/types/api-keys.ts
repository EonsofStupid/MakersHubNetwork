
export type ChatAPIProvider = 'openai' | 'anthropic' | 'replicate' | 'stability' | 'custom';

export interface APIKeyDetails {
  id: string;
  name: string;
  provider: ChatAPIProvider;
  created_at: string;
  last_used?: string;
  is_active: boolean;
  reference?: string; // Masked key for display
}

export interface CreateAPIKeyRequest {
  name: string;
  provider: ChatAPIProvider;
  key: string;
  settings?: Record<string, any>;
}
