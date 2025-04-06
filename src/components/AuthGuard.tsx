
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UserRole } from '@/types/auth.unified';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles = [],
  redirectTo = '/auth'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, roles, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      // First check if user is authenticated
      if (!isAuthenticated || !user) {
        // Store the attempted URL for redirecting after login
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        navigate(`${redirectTo}?returnUrl=${returnUrl}`);
        return;
      }
      
      // Then check role-based access if roles are specified
      if (allowedRoles.length > 0) {
        const hasRequiredRole = roles.some(role => 
          allowedRoles.includes(role as UserRole)
        );
        
        if (!hasRequiredRole) {
          // User is authenticated but lacks the required role - redirect to unauthorized
          navigate('/unauthorized');
          return;
        }
      }
      
      // If we get here, user is authenticated and authorized
      setIsAuthorized(true);
    }
  }, [isAuthenticated, isLoading, roles, user, allowedRoles, navigate, location.pathname, location.search, redirectTo]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return isAuthorized ? <>{children}</> : null;
}

export default AuthGuard;
