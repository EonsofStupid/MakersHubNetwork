
import React from 'react';
import { UserRole } from '../constants/roles';
import { RBACBridge } from '../bridge';

interface RoleGuardProps {
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that conditionally renders content based on user roles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  fallback = null,
  children
}) => {
  if (!RBACBridge.hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * Component that only renders content for admin users
 */
export const AdminGuard: React.FC<Omit<RoleGuardProps, 'allowedRoles'>> = (props) => {
  return <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} {...props} />;
};

/**
 * Component that only renders content for super admin users
 */
export const SuperAdminGuard: React.FC<Omit<RoleGuardProps, 'allowedRoles'>> = (props) => {
  return <RoleGuard allowedRoles={UserRole.SUPER_ADMIN} {...props} />;
};

/**
 * Component that only renders content for moderator users or higher
 */
export const ModeratorGuard: React.FC<Omit<RoleGuardProps, 'allowedRoles'>> = (props) => {
  return <RoleGuard allowedRoles={[UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]} {...props} />;
};

/**
 * Component that only renders content for builder users or higher
 */
export const BuilderGuard: React.FC<Omit<RoleGuardProps, 'allowedRoles'>> = (props) => {
  return <RoleGuard allowedRoles={[UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN]} {...props} />;
};

/**
 * Component that only renders content for authenticated users
 */
export const AuthGuard: React.FC<Omit<RoleGuardProps, 'allowedRoles'>> = (props) => {
  const authenticatedRoles = [UserRole.USER, UserRole.BUILDER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];
  return <RoleGuard allowedRoles={authenticatedRoles} {...props} />;
};
