
import { useAuthStore } from "@/stores/auth/store";

/**
 * Hook to check if the current user has admin access
 * Uses the roles array from auth store to determine admin access
 */
export const useAdminAccess = () => {
  const { roles, isAdmin } = useAuthStore();
  
  // Check if user has admin role using the auth store's roles array
  const hasAdminAccess = isAdmin() || roles.includes('admin') || roles.includes('super_admin');
  
  return {
    hasAdminAccess,
  };
};
