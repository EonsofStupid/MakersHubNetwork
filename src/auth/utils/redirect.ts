
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthStatus } from '@/shared/types/shared.types';
import { useAuthStore } from '../store/auth.store';

/**
 * Hook to redirect users based on authentication status
 */
export const useAuthRedirect = (
  redirectTo: string,
  mode: 'authenticated' | 'unauthenticated' = 'unauthenticated'
) => {
  const navigate = useNavigate();
  const { status, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    // Only redirect if auth is initialized
    if (status !== AuthStatus.LOADING && status !== AuthStatus.IDLE) {
      if (mode === 'authenticated' && !isAuthenticated) {
        navigate(redirectTo);
      } else if (mode === 'unauthenticated' && isAuthenticated) {
        navigate(redirectTo);
      }
    }
  }, [status, isAuthenticated, navigate, redirectTo, mode]);
};
