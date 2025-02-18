
import { useAuthStore } from "@/app/stores/auth/store"
import { UserRole } from "@/types/auth.types"

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

export const useAdminAccess = (): { hasAdminAccess: boolean } => {
  const role = useAuthStore((state) => state.role)
  const hasAdminAccess = role ? ADMIN_ROLES.includes(role) : false

  console.log("useAdminAccess - Current role:", role)
  console.log("useAdminAccess - Has admin access:", hasAdminAccess)

  return { hasAdminAccess }
}
