import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom, isInitializedAtom, authStatusAtom } from '@/atoms/auth.atoms';
import { isAdminAtom } from '@/atoms/rbac.atoms';
import { AUTH_STATUS } from '@/types/shared';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { UnauthorizedError } from '@/shared/components/errors/UnauthorizedError';

interface AdminAuthGuardProps {
  children: ReactNode;
}

/**
 * AdminAuthGuard component
 * Protects admin routes by checking authentication and admin role
 */
export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isInitialized] = useAtom(isInitializedAtom);
  const [status] = useAtom(authStatusAtom);
  const [isAdmin] = useAtom(isAdminAtom);

  // Show loading state while initializing
  if (!isInitialized || status === AUTH_STATUS.LOADING) {
    return <LoadingSpinner />;
  }

  // Show unauthorized error if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <UnauthorizedError />;
  }

  // Render children if authenticated and has admin role
  return <>{children}</>;
}
