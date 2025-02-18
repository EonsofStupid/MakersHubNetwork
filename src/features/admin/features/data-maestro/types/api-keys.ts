
export type ApiKeyCategory = 'ai_service' | 'integration';

export type ApiKeyType = 'openai' | 'stability' | 'replicate' | 'custom' | 'zapier' | 'pinecone' | 'anthropic' | 'gemini' | 'openrouter';

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

// Type guards
export const isApiKeyField = (field: unknown): field is ApiKeyField => {
  if (!field || typeof field !== 'object') return false;
  const f = field as any;
  return (
    typeof f.name === 'string' &&
    ['password', 'text', 'url'].includes(f.type) &&
    typeof f.required === 'boolean' &&
    typeof f.validation === 'object' &&
    typeof f.validation.pattern === 'string' &&
    typeof f.validation.message === 'string'
  );
};

export const isApiKeyRequirements = (data: unknown): data is ApiKeyRequirements => {
  if (!data || typeof data !== 'object') return false;
  const d = data as any;
  return (
    ['ai_service', 'integration'].includes(d.category) &&
    Array.isArray(d.fields) &&
    d.fields.every(isApiKeyField) &&
    typeof d.description === 'string' &&
    (d.docs_url === undefined || typeof d.docs_url === 'string')
  );
};
