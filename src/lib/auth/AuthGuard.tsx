import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth-store';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  fallbackPath?: string;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = false,
  requiredRole,
  fallbackPath = '/login'
}: AuthGuardProps) => {
  const navigate = useNavigate();
  const { session, user, isLoading } = useAuthStore();

  useEffect(() => {
    console.log('AuthGuard: Checking access', {
      requireAuth,
      requiredRole,
      hasSession: !!session,
      userRole: user?.role
    });

    if (!isLoading) {
      if (requireAuth && !session) {
        console.log('AuthGuard: No session, redirecting to', fallbackPath);
        toast.error('Please sign in to continue');
        navigate(fallbackPath);
        return;
      }

      if (requiredRole && user) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role as string)) {
          console.log('AuthGuard: Insufficient permissions');
          toast.error('You do not have permission to access this page');
          navigate(fallbackPath);
          return;
        }
      }
    }
  }, [session, user, isLoading, requireAuth, requiredRole, navigate, fallbackPath]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return <>{children}</>;
};