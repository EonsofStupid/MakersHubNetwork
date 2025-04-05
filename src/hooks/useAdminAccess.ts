
/**
 * Re-export from admin hooks for backward compatibility
 * This fixes import path issues in components that use the old path
 */
import { useAdminAccess as useAdminAccessImpl } from "@/admin/hooks/useAdminAccess";

export function useAdminAccess() {
  return useAdminAccessImpl();
}
