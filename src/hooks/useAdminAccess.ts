
import { useAuthStore } from "@/stores/auth/store"
import { UserRole } from "@/types/auth.types"

export function useAdminAccess() {
  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  
  // Derived state
  const isAuthenticated = !!user
  const hasAdminRole = roles.includes('admin' as UserRole)
  const hasSuperAdminRole = roles.includes('super_admin' as UserRole)
  
  // Admin access is granted if user has either admin or super_admin role
  const hasAdminAccess = isAuthenticated && (hasAdminRole || hasSuperAdminRole)
  
  // Extended permissions check (can be expanded as needed)
  const canManageUsers = isAuthenticated && hasSuperAdminRole
  
  return {
    user,
    roles,
    isAdmin: isAdmin(),
    hasAdminRole,
    hasSuperAdminRole,
    hasAdminAccess,
    canManageUsers,
    isAuthenticated
  }
}
