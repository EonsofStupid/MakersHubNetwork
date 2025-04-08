
import { Database } from "@/integrations/supabase/types"

// Base role type from database
export type UserRole = Database["public"]["Enums"]["user_role"]

// Auth Event Types
export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'SESSION_UPDATED'
  | 'INITIALIZED';

// Auth Event Interface
export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

// Auth Event Listener Type
export type AuthEventListener = (event: AuthEvent) => void;

// Authentication-specific interfaces
export interface AuthUser {
  id: string
  display_name: string | null
  avatar_url: string | null
  primary_role_id: string | null
  user_roles: Array<{
    id: string
    role: UserRole
  }>
}

export interface AdminAccess {
  isAdmin: boolean
  hasAdminAccess: boolean
}

export interface WithAdminAccess {
  hasAdminAccess: boolean
}

// Re-export for backward compatibility
export type { UserRole as AuthUserRole }
