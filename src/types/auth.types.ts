
import { Database } from "@/integrations/supabase/types"
import { UserRole as BaseUserRole } from "@/auth/types/roles"

// Base role type from database
export type UserRole = BaseUserRole

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
