import { useAuthStore } from "@/app/stores/auth/store"
import { UserRole } from "@/types/auth.types"

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

export const useAdminAccess = (): { hasAdminAccess: boolean } => {
  const roles = useAuthStore((state) => state.roles)
  const hasAdminAccess = roles.some(role => ADMIN_ROLES.includes(role))

  console.log("useAdminAccess - Current roles:", roles)
  console.log("useAdminAccess - Has admin access:", hasAdminAccess)

  return { hasAdminAccess }
}
