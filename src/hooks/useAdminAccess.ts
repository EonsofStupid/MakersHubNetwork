
import { useAuthStore } from "@/stores/auth/store";

/**
 * Hook to check if the current user has admin access
 * This is a simplified version that just checks for a specific role
 */
export const useAdminAccess = () => {
  const { user } = useAuthStore();
  
  // Check if user has admin role
  // In a real app, this would be more sophisticated with proper role checks
  const hasAdminAccess = Boolean(user?.role === 'admin' || user?.email?.includes('admin'));
  
  return {
    hasAdminAccess,
    // Additional admin permission checks could be added here
    // For now, we'll just provide the basic admin access check
  };
};
