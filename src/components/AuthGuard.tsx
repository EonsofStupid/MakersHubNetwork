import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole } from "@/auth/types/auth.types";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/auth/hooks/useAuthState";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  adminOnly?: boolean;
  fallback?: ReactNode;
  publicRoute?: boolean; // Option for public routes that don't require authentication
}

export const AuthGuard = ({ 
  children, 
  requiredRoles, 
  adminOnly,
  fallback = <div>Loading authentication...</div>,
  publicRoute = false // Default to protected route
}: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { toast } = useToast();
  const logger = useLogger("AuthGuard", LogCategory.AUTH);
  
  // Use centralized auth state
  const { isLoading, status, roles, user, initialized } = useAuthState();
  const { hasAdminAccess } = useAdminAccess();

  const isAuthenticated = status === "authenticated" && !!user?.id;

  // Check if user has required roles or admin access when needed
  const hasRequiredRole = requiredRoles 
    ? requiredRoles.some(r => roles.includes(r)) || hasAdminAccess
    : true;

  // Special check for admin routes
  const hasAdminPermission = adminOnly ? hasAdminAccess : true;

  useEffect(() => {
    // For public routes, we don't need to check authentication status
    if (publicRoute) return;
    
    // Only perform checks after auth is initialized
    if (!initialized) return;
    
    if (!isLoading && !isAuthenticated) {
      logger.info("AuthGuard - Redirecting to login: Not authenticated", {
        details: { path: pathname }
      });
      // Keep track of the current path to redirect back after login
      const currentPath = pathname;
      
      // Redirect to login page with return path in search params
      const loginParams = new URLSearchParams();
      loginParams.set('from', encodeURIComponent(currentPath));
      navigate(`/login?${loginParams.toString()}`);
      return;
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRequiredRole) {
      logger.info("AuthGuard - Redirecting to unauthorized: Missing required roles", {
        details: { requiredRoles, userRoles: roles }
      });
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page"
      });
      navigate('/');
    }

    if (!isLoading && isAuthenticated && adminOnly && !hasAdminPermission) {
      logger.info("AuthGuard - Redirecting: Not an admin", {
        details: { userRoles: roles }
      });
      toast({
        variant: "destructive",
        title: "Admin Access Required",
        description: "You need admin privileges to access this section"
      });
      navigate('/');
    }
  }, [
    isLoading, 
    isAuthenticated, 
    roles, 
    requiredRoles, 
    adminOnly, 
    hasRequiredRole, 
    hasAdminPermission, 
    navigate, 
    pathname, 
    toast,
    logger,
    initialized,
    publicRoute
  ]);

  // For public routes, always render children regardless of auth status
  if (publicRoute) {
    return <>{children}</>;
  }

  // For protected routes, show fallback while loading
  if (isLoading && !initialized) return <>{fallback}</>;
  
  // If auth is initialized and it's a protected route that requires auth
  if (initialized && !publicRoute && !isAuthenticated) return null;
  
  // Check role requirements
  if (initialized && requiredRoles && !hasRequiredRole) return null;
  
  // Check admin requirements
  if (initialized && adminOnly && !hasAdminPermission) return null;

  // Otherwise render children
  return <>{children}</>;
};
