
import { useAuthState } from "@/auth/hooks/useAuthState";

interface AdminAccessOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
}

/**
 * Hook for checking admin access permissions
 * Uses useAuthState directly to avoid circular dependencies
 */
export function useAdminAccess(options: AdminAccessOptions = { requireAuth: true }) {
  const { user, roles, status } = useAuthState();
  
  const hasAdminAccess = (): boolean => {
    // If authentication is required and user is not logged in
    if (options.requireAuth && (!user || status !== 'authenticated')) {
      return false;
    }
    
    // Check if user has admin or super_admin role
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    
    // If specific roles are required
    if (options.allowedRoles && options.allowedRoles.length > 0) {
      return options.allowedRoles.some(role => roles.includes(role));
    }
    
    // Default to admin check
    return isAdmin;
  };
  
  return {
    hasAdminAccess: hasAdminAccess(),
    user
  };
}
