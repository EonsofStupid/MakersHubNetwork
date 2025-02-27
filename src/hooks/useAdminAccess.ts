
import { useAuthStore } from "@/stores/auth/store"
import { UserRole } from "@/types/auth.types"

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

export const useAdminAccess = () => {
  const { roles, status } = useAuthStore((state) => ({
    roles: state.roles,
    status: state.status
  }))
  
  const hasAccess = roles.some(role => ADMIN_ROLES.includes(role))
  const hasAdminAccess = hasAccess // Alias for backward compatibility
  const isLoading = status === "loading"

  return { hasAccess, hasAdminAccess, isLoading }
}
