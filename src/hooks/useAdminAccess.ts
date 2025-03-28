
import { useAuthStore } from '@/stores/auth/store';

export function useAdminAccess() {
  const { user } = useAuthStore();
  
  const hasAdminAccess = user?.roles?.some(
    role => role === 'admin' || role === 'super_admin'
  ) || false;
  
  return { hasAdminAccess };
}
