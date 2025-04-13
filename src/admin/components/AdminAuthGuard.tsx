import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useRbac } from '@/auth/rbac/use-rbac';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, AuthStatus, ROLES } from '@/shared/types/shared.types';
import { AccessDenied } from './auth/AccessDenied';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requirePermission?: string;
  fallbackPath?: string;
}

export function AdminAuthGuard({ 
  children, 
  requirePermission,
  fallbackPath = '/admin/unauthorized'
}: AdminAuthGuardProps) {
  const { 
    status, 
    user, 
    initialize,
    initialized
  } = useAuthStore();
  const { hasAdminAccess } = useRbac();
  const navigate = useNavigate();
  const logger = useLogger('AdminAuthGuard', LogCategory.AUTH);
  
  // Initialize auth store if not already initialized
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);
  
  // Wait for authentication to complete
  if (status === AuthStatus.LOADING || status === AuthStatus.IDLE) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (status === AuthStatus.UNAUTHENTICATED) {
    logger.info('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }
  
  // If authentication failed, show error
  if (status === AuthStatus.ERROR) {
    logger.error('Authentication error');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">There was a problem authenticating your account.</p>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          onClick={() => navigate('/login')}
        >
          Return to Login
        </button>
      </div>
    );
  }
  
  // Check if user has admin access
  if (!hasAdminAccess()) {
    logger.warn(`Access denied: User ${user?.id} does not have admin access`);
    return <AccessDenied message="You need administrator privileges to access this area." />;
  }
  
  // If a specific permission is required, check for it
  if (requirePermission) {
    // For now, we'll just check for admin access
    // In a real app, you would have a more granular permission system
    if (!hasAdminAccess()) {
      logger.warn(`Access denied: User ${user?.id} lacks required permission: ${requirePermission}`);
      return <AccessDenied message={`You don't have the required permission: ${requirePermission}`} />;
    }
  }
  
  // All checks passed, render children
  return <>{children}</>;
}
