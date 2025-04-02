
/**
 * @deprecated Use useAdminAccess from @/admin/hooks/useAdminAccess instead
 * This is kept for backward compatibility
 */
import { useAdminAccess as useAdminAccessImpl } from "@/admin/hooks/useAdminAccess";
export function useAdminAccess() {
  return useAdminAccessImpl();
}
