
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
