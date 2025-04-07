
import React, { useMemo } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { UserRole } from '@/auth/hooks/useAuth';

interface RequirePermissionProps {
  permission?: string;
  role?: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showMessage?: boolean;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  role,
  children,
  fallback,
  redirectTo = '/auth/login',
  showMessage = true
}) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const navigate = useNavigate();
  
  // Extract roles for safety - always return an array
  const userRoles = useMemo(() => {
    if (!user || !user.role) return [];
    return [user.role as UserRole];
  }, [user]);

  // Check permissions
  const hasPermission = useMemo(() => {
    // If no permission or role is required, allow access
    if (!permission && !role) return true;
    
    // Must be authenticated first
    if (!isAuthenticated || !user) return false;
    
    // Check role requirement if specified
    if (role) {
      return hasRole(role);
    }
    
    // Check permission if specified
    if (permission) {
      // Currently permissions are not implemented, so fall back to admin check
      return userRoles.includes('admin') || userRoles.includes('super_admin');
    }
    
    return false;
  }, [isAuthenticated, user, role, permission, hasRole, userRoles]);

  // If still loading, don't render anything yet
  if (isLoading) {
    return null;
  }
  
  // If user doesn't have permission, handle according to props
  if (!hasPermission) {
    // Redirect if specified
    if (redirectTo) {
      navigate(redirectTo, { 
        replace: true,
        state: { from: window.location.pathname }
      });
      return null;
    }
    
    // Show fallback content if provided
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Show default permission error message
    if (showMessage) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Permission Required</h2>
          <p className="text-muted-foreground mb-6">
            You don't have the necessary permissions to access this content.
          </p>
        </div>
      );
    }
    
    // Return nothing if no fallback and showMessage is false
    return null;
  }
  
  // User has permission, render children
  return <>{children}</>;
};
