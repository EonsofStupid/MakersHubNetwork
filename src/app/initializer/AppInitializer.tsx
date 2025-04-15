import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useRBACStore } from '@/rbac/rbac.store';
import { ROLES } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { status, isAuthenticated } = useAuthStore();
  const { setUserRoles } = useRBACStore();
  
  useEffect(() => {
    if (status !== 'LOADING') {
      if (isAuthenticated) {
        setUserRoles([ROLES.user]);
      }
      
      setIsInitialized(true);
    }
  }, [status, isAuthenticated, setUserRoles]);
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}
