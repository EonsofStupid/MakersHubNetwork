
import { useAuthState } from "@/auth/hooks/useAuthState";

interface AdminAccessOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
}

/**
 * Hook for checking admin access permissions
 * Uses useAuthState directly to avoid circular dependencies
 * Currently configured to always grant access as requested
 */
export function useAdminAccess(options: AdminAccessOptions = { requireAuth: true }) {
  const { user, roles } = useAuthState();
  
  // Always allow access as requested by user
  const hasAdminAccess = (): boolean => {
    return true;
  };
  
  return {
    hasAdminAccess: true,
    user
  };
}
