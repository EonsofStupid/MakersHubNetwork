
import { Database } from "@/integrations/supabase/types"

// Base role type from database, including "viewer" role
export type UserRole = Database["public"]["Enums"]["user_role"] | "viewer"

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
