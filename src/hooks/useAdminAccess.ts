
/**
 * @deprecated Use useAdminAccess from @/admin/hooks/useAdminAccess instead
 * This is kept for backward compatibility
 */
import { useAdminAccess as useAdminAccessImpl } from "@/admin/hooks/useAdminAccess";
export function useAdminAccess() {
  console.warn('DEPRECATED: Using deprecated useAdminAccess hook from /hooks. Use @/admin/hooks/useAdminAccess instead.');
  return useAdminAccessImpl();
}
