
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { UserRole } from '@/auth/types/auth.types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Specialized hook for admin authentication
 * Provides admin-specific authentication state and operations
 */
export function useAdminAuth() {
  const logger = useLogger('useAdminAuth', LogCategory.ADMIN);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Access auth state
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  
  // Derive admin status
  const isAdmin = useAuthStore(state => state.isAdmin());
  const isSuperAdmin = useAuthStore(state => state.isSuperAdmin());
  
  // Compute additional admin-specific derived state
  const hasAdminAccess = useMemo(() => {
    return isAdmin || isSuperAdmin;
  }, [isAdmin, isSuperAdmin]);
  
  // Check if user has specific admin role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    return roles.includes(role);
  }, [roles]);
  
  // Guard navigation to ensure only admin users can access
  const guardAdminAccess = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access the admin area",
        variant: "destructive"
      });
      navigate('/login');
      return false;
    }
    
    if (!hasAdminAccess) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive"
      });
      navigate('/');
      return false;
    }
    
    return true;
  }, [isAuthenticated, hasAdminAccess, toast, navigate]);
  
  // Force redirect if user doesn't have admin access
  const redirectIfNotAdmin = useCallback(() => {
    if (!isAuthenticated) {
      logger.warn("Unauthenticated user attempted to access admin section");
      navigate('/login');
      return;
    }
    
    if (!hasAdminAccess) {
      logger.warn("Non-admin user attempted to access admin section", {
        details: { userId: user?.id, roles }
      });
      navigate('/');
    }
  }, [isAuthenticated, hasAdminAccess, user, roles, logger, navigate]);
  
  return {
    user,
    profile,
    roles,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess,
    status,
    hasRole,
    guardAdminAccess,
    redirectIfNotAdmin
  };
}
