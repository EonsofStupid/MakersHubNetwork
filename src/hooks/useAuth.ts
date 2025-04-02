
/**
 * @deprecated Use useAuth from @/auth/hooks/useAuth instead
 * This is kept for backward compatibility
 */
import { useAuth as useAuthImpl } from '@/auth/hooks/useAuth';

export function useAuth() {
  return useAuthImpl();
}
