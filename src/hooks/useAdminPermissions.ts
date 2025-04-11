
/**
 * @deprecated Use useAdminPermissions from @/admin/hooks/useAdminPermissions instead
 * This is kept for backward compatibility
 */
import { useAdminPermissions as useAdminPermissionsImpl } from "@/admin/hooks/useAdminPermissions.tsx";
export function useAdminPermissions() {
  return useAdminPermissionsImpl();
}
