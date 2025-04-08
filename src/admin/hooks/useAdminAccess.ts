
import { useAuthState } from "@/auth/hooks/useAuthState";
import { UserRole } from "@/auth/types/auth.types";
import { useMemo } from "react";

interface AdminAccessOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

/**
 * Hook for checking admin access permissions
 * Uses useAuthState directly to avoid circular dependencies
 */
export function useAdminAccess(options: AdminAccessOptions = { requireAuth: true }) {
  const { user, roles = [], status = 'loading', isAuthenticated } = useAuthState();
  
  // Use memoization to prevent recalculations on every render
  const hasAdminAccess = useMemo(() => {
    // If authentication is required and user is not logged in
    if (options.requireAuth && !isAuthenticated) {
      return false;
    }
    
    // Check if user has admin or super_admin role
    const isAdmin = roles.includes('admin' as UserRole) || roles.includes('super_admin' as UserRole);
    
    // If specific roles are required
    if (options.allowedRoles && options.allowedRoles.length > 0) {
      return options.allowedRoles.some(role => roles.includes(role));
    }
    
    // Default to admin check
    return isAdmin;
  }, [isAuthenticated, roles, options.requireAuth, options.allowedRoles]);
  
  return {
    hasAdminAccess,
    user,
    isAuthenticated,
    isLoading: status === 'loading'
  };
}
