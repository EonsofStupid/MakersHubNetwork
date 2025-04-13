
import React, { ReactNode } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { AccessDenied } from './AccessDenied';
import { ROLES, LogCategory, UserRole, AuthStatus } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

interface AdminAuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

/**
 * AdminAuthGuard component
 * Protects admin routes by checking authentication and admin role
 */
export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ 
  children, 
  requiredRole = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
}) => {
  const { isAuthenticated, status } = useAuthStore();
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);

  // Log current roles
  React.useEffect(() => {
    if (isAuthenticated) {
      const roles = RBACBridge.getRoles();
      logger.debug('Current roles in AdminAuthGuard', {
        details: { roles, requiredRole }
      });
    }
  }, [isAuthenticated, requiredRole, logger]);

  // Show loading state while initializing
  if (status === AuthStatus.LOADING) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated and has admin role
  const hasRequiredRole = isAuthenticated && RBACBridge.hasRole(requiredRole);

  logger.debug('Access check result', { 
    details: { 
      isAuthenticated, 
      hasRequiredRole, 
      status 
    } 
  });

  // Show unauthorized error if not authenticated or not admin
  if (!hasRequiredRole) {
    return <AccessDenied />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

// Also create the AccessDenied component for use by AdminAuthGuard
<lov-write file_path="src/admin/panels/auth/AccessDenied.tsx">
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthStatus } from '@/shared/types/shared.types';

export const AccessDenied: React.FC = () => {
  const { status, isAuthenticated } = useAuthStore();
  
  // Different message based on auth state
  const getMessage = () => {
    if (status === AuthStatus.LOADING) {
      return "Checking permissions...";
    }
    
    if (!isAuthenticated) {
      return "You need to be logged in to access this area.";
    }
    
    return "You don't have permission to access this area.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-destructive">Access Denied</h1>
        <p className="text-foreground mb-6">{getMessage()}</p>
        
        <div className="flex flex-col gap-4">
          {!isAuthenticated && (
            <a 
              href="/auth" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-center"
            >
              Log In
            </a>
          )}
          
          <a 
            href="/" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-center"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};
