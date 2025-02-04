import { useAuthStore } from "@/stores/auth/store"
import { AdminAccess, UserRole } from "@/types/auth.types"

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

export const useAdminAccess = (): AdminAccess => {
  const roles = useAuthStore((state) => state.roles)
  
  // Check for admin level access (admin or super_admin)
  const isAdmin = roles.some(role => ADMIN_ROLES.includes(role as UserRole))
  
  return {
    isAdmin,
    hasAdminAccess: isAdmin,
  }
}