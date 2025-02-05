import { useAuthStore } from "@/stores/auth/store"
import { AdminAccess, UserRole } from "@/types/auth.types"

// Simple check for admin-level roles
const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

export const useAdminAccess = (): AdminAccess => {
  const roles = useAuthStore((state) => state.roles)
  
  // Simple check - is the user an admin or super_admin
  const hasAdminAccess = roles.some(role => ADMIN_ROLES.includes(role))
  
  return {
    isAdmin: hasAdminAccess,
    hasAdminAccess,
  }
}