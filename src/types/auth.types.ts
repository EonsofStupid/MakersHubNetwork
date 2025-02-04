import { Database } from "@/integrations/supabase/types"

export type UserRole = Database["public"]["Enums"]["user_role"]

export interface AdminAccess {
  isAdmin: boolean
  hasAdminAccess: boolean
}

export interface WithAdminAccess {
  hasAdminAccess: boolean
}

export interface UserWithRoles {
  id: string
  display_name: string | null
  avatar_url: string | null
  primary_role_id: string | null
  user_roles: Array<{
    id: string
    role: UserRole
  }>
}