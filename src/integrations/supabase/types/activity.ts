import { Database } from './database';

export type UserActivity = Database['public']['Tables']['user_activity']['Row'];
export type SecurityEvent = Database['public']['Tables']['security_events']['Row'];
export type SecurityAuditLog = Database['public']['Tables']['security_audit_logs']['Row'];

export interface ActivityMetadata {
  ip?: string;
  userAgent?: string;
  location?: string;
  deviceInfo?: {
    type: string;
    os: string;
    browser: string;
  };
  [key: string]: any;
}

export interface SecurityEventDetails {
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  metadata?: ActivityMetadata;
}