
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/shared/types';

interface AdminOnlyProps {
  children: ReactNode;
  redirectTo?: string;
  showError?: boolean;
  allowSuperAdmin?: boolean;
}

export function AdminOnly({
  children,
  redirectTo = '/',
  showError = true,
  allowSuperAdmin = true,
}: AdminOnlyProps) {
  const { hasRole, status } = useAuthStore();
  const { isLoading } = status;

  // Don't render anything while loading
  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }

  // Check if the user has the admin role
  const rolesToCheck: UserRole[] = ['admin'];
  if (allowSuperAdmin) {
    rolesToCheck.push('superadmin');
  }

  if (!hasRole(rolesToCheck)) {
    if (showError) {
      return (
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md mx-auto text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this area.
            </p>
            <Navigate to={redirectTo} replace />
          </div>
        </div>
      );
    }

    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
