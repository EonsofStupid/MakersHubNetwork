
export interface ApiKeyField {
  name: string;
  type: string;
  required: boolean;
  validation?: {
    pattern: string;
    message: string;
  };
}

export interface ApiKeyProviderConfig {
  category: string;
  fields: ApiKeyField[];
  description: string;
  docs_url?: string;
}

export interface ApiKeyFormData {
  name: string;
  key_type: string;
  api_key: string;
  description: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_type: string;
  description?: string;
  created_at: string;
  last_used_at?: string;
  access_count: number;
  is_active: boolean;
}

export interface ApiKeyAuditLog {
  id: string;
  api_key_id: string;
  action: string;
  performed_by: string;
  performed_at: string;
  metadata: Record<string, any>;
}
