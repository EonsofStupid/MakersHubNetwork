
export type ApiKeyType = 'openai' | 'stability_ai' | 'replicate' | 'anthropic' | 'custom';
export type ApiKeyCategory = 'ai_service' | 'third_party' | 'internal' | 'other';

export interface ApiKeyProviderConfig {
  model?: string;
  baseUrl?: string;
  organizationId?: string;
  version?: string;
  extra?: Record<string, any>;
}

export interface ApiKey {
  id: string;
  name: string;
  key_type: ApiKeyType;
  category: ApiKeyCategory;
  reference_key?: string; // Masked version of the key
  description?: string;
  provider_config?: ApiKeyProviderConfig;
  is_active: boolean;
  access_count: number;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ApiKeyFormData {
  name: string;
  key_type: ApiKeyType;
  key_value: string;
  description?: string;
  provider_config?: ApiKeyProviderConfig;
  expires_at?: string | null;
}

export interface ApiKeyAuditLog {
  id: string;
  action: string;
  api_key_id: string;
  performed_by?: string;
  performed_at: string;
  metadata?: Record<string, any>;
}
