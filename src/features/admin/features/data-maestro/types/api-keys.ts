
export type ApiKeyCategory = 'ai_service' | 'integration';

export type ApiKeyType = 'openai' | 'stability' | 'replicate' | 'custom' | 'zapier' | 'pinecone';

export interface ApiKeyField {
  name: string;
  type: 'password' | 'text' | 'url';
  required: boolean;
  validation: {
    pattern: string;
    message: string;
  };
}

export interface ApiKeyRequirements {
  category: ApiKeyCategory;
  fields: ApiKeyField[];
  description: string;
  docs_url?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_type: ApiKeyType;
  category: ApiKeyCategory;
  description?: string;
  provider_config: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
  access_count: number;
}

export interface ApiKeyFormData {
  name: string;
  key_type: ApiKeyType;
  description?: string;
  provider_config: Record<string, any>;
}
