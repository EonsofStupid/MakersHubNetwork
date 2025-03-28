export interface Sensor {
  id: string;
  type: string;
  accuracy: string;
  firmware_compatibility: string[];
  printer_models: string[];
  mounting_type: string;
  dimensions: string;
  weight: string;
  probe_material: string;
  connector_type: string;
  has_self_test: boolean;
  includes_alarm: boolean;
  average_price: number;
  site_rating: number;
  average_rating: number;
  image_url: string;
  english_reviews_count: number;
  summary: string;
  pros: string[];
  cons: string[];
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  price: number;
  trending: boolean;
  value_rating: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export type APIKeyType = 'openai' | 'stability' | 'replicate' | 'custom';

export interface APIKey {
  id: string;
  name: string;
  key_type: APIKeyType;
  description: string | null;
  metadata: Record<string, any>;
  access_count: number;
  last_accessed_from: string | null;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
  is_active: boolean;
  reference_key: string;
}

export interface APIKeyAuditLog {
  id: string;
  api_key_id: string | null;
  action: string;
  performed_by: string | null;
  performed_at: string;
  metadata: Record<string, any>;
}

export type Database = {
  public: {
    Tables: {
      sensors: {
        Row: Sensor;
        Insert: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Sensor, 'id'>>;
      };
      components: {
        Row: Component;
        Insert: Omit<Component, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Component, 'id'>>;
      };
      api_keys: {
        Row: APIKey;
        Insert: Omit<APIKey, 'id' | 'created_at' | 'updated_at' | 'access_count' | 'last_accessed_from' | 'last_used_at'>;
        Update: Partial<Omit<APIKey, 'id'>>;
      };
      api_key_audit_logs: {
        Row: APIKeyAuditLog;
        Insert: Omit<APIKeyAuditLog, 'id' | 'performed_at'>;
        Update: Partial<Omit<APIKeyAuditLog, 'id'>>;
      };
    };
    Enums: {
      api_key_type: APIKeyType;
    };
  };
};

export type DatabaseTables = {
  sensors: Sensor;
  components: Component;
  api_keys: APIKey;
  api_key_audit_logs: APIKeyAuditLog;
}
