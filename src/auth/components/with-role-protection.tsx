import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, RBAC } from '@/shared/types/shared.types';
import { useHasRole } from '@/hooks/use-rbac';

interface WithRoleProtectionProps {
  allowedRoles: UserRole | UserRole[];
  redirectPath?: string;
  fallbackComponent?: React.ReactNode;
}

/**
 * Higher-order component for protecting routes based on roles
 * 
 * @param WrappedComponent - The component to protect
 * @param options - Options for role protection
 * @returns A new component that checks for roles before rendering
 */
export const withRoleProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithRoleProtectionProps
) => {
  const { allowedRoles, redirectPath = '/', fallbackComponent } = options;
  
  return (props: P) => {
    const hasRequiredRole = useHasRole(allowedRoles);
    const navigate = useNavigate();
    
    React.useEffect(() => {
      if (!hasRequiredRole && redirectPath) {
        navigate(redirectPath);
      }
    }, [hasRequiredRole, navigate, redirectPath]);
    
    if (!hasRequiredRole) {
      return fallbackComponent || null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

/**
 * Pre-configured HOC for admin-only routes
 */
export const withAdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath = '/'
) => {
  return withRoleProtection(WrappedComponent, {
    allowedRoles: RBAC.adminOnly,
    redirectPath
  });
};

/**
 * Pre-configured HOC for super admin-only routes
 */
export const withSuperAdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath = '/'
) => {
  return withRoleProtection(WrappedComponent, {
    allowedRoles: RBAC.superAdmins,
    redirectPath
  });
};

/**
 * Pre-configured HOC for moderator-only routes
 */
export const withModeratorProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath = '/'
) => {
  return withRoleProtection(WrappedComponent, {
    allowedRoles: RBAC.moderators,
    redirectPath
  });
};

/**
 * Pre-configured HOC for builder-only routes
 */
export const withBuilderProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath = '/'
) => {
  return withRoleProtection(WrappedComponent, {
    allowedRoles: RBAC.builders,
    redirectPath
  });
};

/**
 * Pre-configured HOC for authenticated-only routes
 */
export const withAuthProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath = '/login'
) => {
  return withRoleProtection(WrappedComponent, {
    allowedRoles: RBAC.authenticated,
    redirectPath
  });
}; 