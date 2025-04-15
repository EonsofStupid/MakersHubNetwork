
import { useAuthStore } from '@/auth/store/auth.store';
import { AUTH_STATUS } from '@/shared/types/shared.types';

export function redirectIfAuthenticated(navigate: (path: string) => void, to: string = '/') {
  const status = useAuthStore.getState().status;
  
  if (status === AUTH_STATUS.AUTHENTICATED) {
    navigate(to);
    return true;
  }
  return false;
}

export function redirectIfLoading(navigate: (path: string) => void, to: string = '/loading') {
  const status = useAuthStore.getState().status;
  
  if (status === AUTH_STATUS.LOADING) {
    navigate(to);
    return true;
  }
  return false;
}

export function redirectIfUnauthenticated(navigate: (path: string) => void, to: string = '/login') {
  const status = useAuthStore.getState().status;
  
  if (status !== AUTH_STATUS.AUTHENTICATED) {
    navigate(to);
    return true;
  }
  return false;
}

export function redirectBasedOnAuth(
  navigate: (path: string) => void, 
  authenticatedPath: string = '/', 
  unauthenticatedPath: string = '/login'
) {
  const status = useAuthStore.getState().status;
  
  if (status === AUTH_STATUS.AUTHENTICATED) {
    navigate(authenticatedPath);
    return true;
  } else if (status !== AUTH_STATUS.LOADING) {
    navigate(unauthenticatedPath);
    return true;
  }
  return false;
}
