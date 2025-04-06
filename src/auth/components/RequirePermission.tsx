import React from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/auth/types/auth.types'; // Using auth.types instead of userRoles
import { hasRequiredRole } from '@/auth/utils/roleHelpers';
import { AuthSearchParams } from '@/router/searchParams'; // Using AuthSearchParams directly
import { navigateTo } from '@/utils/router-helpers';
import { useRouter } from '@tanstack/react-router';

interface RequirePermissionProps {
  children?: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: UserRole;
}

/**
 * Component for protecting routes based on user permissions
 * Can be used as a wrapper or as a Route element
 */
export const RequirePermission = ({
  children,
  redirectTo = '/login',
  fallback,
  allowedRoles,
  requiredPermission
}: RequirePermissionProps) => {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const router = useRouter();

  // Wait until auth is loaded
  if (isLoading) {
    return null; // Show nothing while loading
  }

  // Check if the user is authenticated
  if (!isAuthenticated || !user) {
    // Redirect to login page if not authenticated
    router.navigate({
      to: navigateTo(redirectTo),
      search: { from: router.state.location.pathname }
    });
    return null;
  }

  // Check for required roles
  const hasRequiredRoles = allowedRoles
    ? user.roles.some(role => allowedRoles.includes(role))
    : true;

  // Specific permission check (if needed)
  const hasSpecificPermission = requiredPermission
    ? hasRequiredRole(user.roles, requiredPermission)
    : true;

  if (!hasRequiredRoles || !hasSpecificPermission) {
    // Render fallback content or redirect if permission is denied
    return fallback ? <>{fallback}</> : (
      router.navigate({
        to: navigateTo(redirectTo),
        search: { from: router.state.location.pathname }
      })
    );
  }

  return <>{children}</>;
};
