
import { useAdminStore } from '@/admin/store/admin.store';

/**
 * Hook for checking admin permissions
 * This maintains proper boundary separation between admin module permissions
 */
export function useAdminPermissions() {
  const { hasPermission, hasRole } = useAdminStore();
  
  return {
    hasPermission,
    hasRole
  };
}
