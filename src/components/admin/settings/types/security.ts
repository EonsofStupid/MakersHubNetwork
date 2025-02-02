import { Json } from '@/integrations/supabase/types';

export interface SecuritySettings extends Record<string, Json> {
  ip_whitelist: string[];
  ip_blacklist: string[];
  max_login_attempts: number;
  lockout_duration_minutes: number;
  session_timeout_minutes: number;
  rate_limit_requests: number;
  rate_limit_window_minutes: number;
  allowed_countries: string[];
}

export interface SiteSecuritySettings {
  security_settings: SecuritySettings;
}

export interface SecurityLog {
  id: string;
  event_type: string;
  ip_address: string | null;
  user_id: string | null;
  created_at: string;
  metadata: Json;
  user_agent: string | null;
  profiles?: {
    username: string | null;
    display_name: string | null;
  } | null;
}