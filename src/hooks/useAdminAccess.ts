import { useAuthStore } from "@/stores/auth/store"
import { AdminAccess } from "@/types/auth.types"

export const useAdminAccess = (): AdminAccess => {
  const roles = useAuthStore((state) => state.roles)
  
  // Check for both admin and super_admin roles
  const isAdmin = roles.includes("admin") || roles.includes("super_admin")
  
  return {
    isAdmin,
    hasAdminAccess: isAdmin,
  }
}