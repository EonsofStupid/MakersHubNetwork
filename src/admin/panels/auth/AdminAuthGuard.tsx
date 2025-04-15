
import React from 'react';
import { Navigate } from 'react-router-dom';
import { RBACBridge } from '@/rbac/bridge';
import { UserRole } from '@/shared/types/shared.types';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole | UserRole[];
}

export function AdminAuthGuard({ children, requiredRole }: AdminAuthGuardProps) {
  // Get roles that the user has
  const hasRole = RBACBridge.hasRole(requiredRole);
  
  // If user doesn't have required role, redirect to unauthorized page
  if (!hasRole) {
    return <Navigate to="/admin/unauthorized" replace />;
  }
  
  // Return children if user has required role
  return <>{children}</>;
}
