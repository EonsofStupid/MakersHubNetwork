
import React from 'react';
import { UserRole, ROLES } from '@/shared/types/shared.types';
import { useRbac } from '@/auth/rbac/use-rbac';

interface RoleGateProps {
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component for conditional rendering based on roles
 * 
 * @param props - Component props
 * @returns React component that conditionally renders based on roles
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  fallback = null,
  children
}) => {
  const { hasRole } = useRbac();
  
  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * Pre-configured component for admin-only content
 */
export const AdminGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = (props) => {
  return <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} {...props} />;
};

/**
 * Pre-configured component for super admin-only content
 */
export const SuperAdminGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = (props) => {
  return <RoleGate allowedRoles={ROLES.SUPER_ADMIN} {...props} />;
};

/**
 * Pre-configured component for moderator-only content
 */
export const ModeratorGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = (props) => {
  return <RoleGate allowedRoles={[ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]} {...props} />;
};

/**
 * Pre-configured component for builder-only content
 */
export const BuilderGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = (props) => {
  return <RoleGate allowedRoles={[ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]} {...props} />;
};

/**
 * Pre-configured component for authenticated-only content
 */
export const AuthGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = (props) => {
  return <RoleGate allowedRoles={[ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.BUILDER]} {...props} />;
};
