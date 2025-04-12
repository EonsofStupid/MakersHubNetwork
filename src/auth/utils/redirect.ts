
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/shared/types';

/**
 * Hook to redirect authenticated users
 * @param redirectPath Path to redirect to
 * @param condition Optional condition to determine if redirect should happen
 */
export function redirectIfAuthenticated(
  redirectPath: string = '/dashboard',
  condition: () => boolean = () => true
): void {
  const navigate = useNavigate();
  const { status } = useAuthStore();
  const { isAuthenticated, isLoading } = status;

  useEffect(() => {
    if (!isLoading && isAuthenticated && condition()) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, condition]);
}

/**
 * Hook to redirect unauthenticated users
 * @param redirectPath Path to redirect to
 * @param condition Optional condition to determine if redirect should happen
 */
export function redirectIfUnauthenticated(
  redirectPath: string = '/auth',
  condition: () => boolean = () => true
): void {
  const navigate = useNavigate();
  const { status } = useAuthStore();
  const { isAuthenticated, isLoading } = status;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && condition()) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, condition]);
}

/**
 * Hook to redirect users without admin role
 * @param redirectPath Path to redirect to
 * @param requiredRoles Roles that are allowed access
 */
export function redirectIfNotAdmin(
  redirectPath: string = '/',
  requiredRoles: UserRole[] = ['admin', 'superadmin']
): void {
  const navigate = useNavigate();
  const { status, hasRole } = useAuthStore();
  const { isAuthenticated, isLoading } = status;
  const hasRequiredRole = hasRole(requiredRoles);

  useEffect(() => {
    // Only check roles if authenticated and not loading
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        navigate('/auth', { replace: true });
        return;
      }
      
      // If authenticated but doesn't have the required role, redirect
      if (!hasRequiredRole) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, navigate, redirectPath]);
}
