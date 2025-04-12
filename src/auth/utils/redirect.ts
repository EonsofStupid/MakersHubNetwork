import { AuthStatus, UserRole } from '@/shared/types/shared.types';

export function redirectIfAuthenticated(status: AuthStatus, roles?: UserRole[]) {
  if (status === 'AUTHENTICATED') {
    // Redirect logic here
    return true;
  }

  if (status === 'LOADING') {
    // Loading logic here
    return true;
  }

  return false;
}

export function redirectIfNotAuthenticated(status: AuthStatus, roles?: UserRole[]) {
  if (status !== 'AUTHENTICATED') {
    // Redirect logic here
    return true;
  }

  return false;
}

export function redirectIfNoAccess(status: AuthStatus, role: UserRole | UserRole[], hasRole: (role: UserRole[]) => boolean) {
  const requiredRoles = Array.isArray(role) ? role : [role];
  
  if (status !== 'AUTHENTICATED') {
    // Redirect logic for not authenticated
    return true;
  }

  if (status === 'LOADING') {
    // Loading logic
    return true;
  }

  if (!hasRole(requiredRoles)) {
    // No access logic
    return true;
  }

  return false;
}
