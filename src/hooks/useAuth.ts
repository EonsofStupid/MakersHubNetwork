
/**
 * @deprecated Use useAuth from @/auth/hooks/useAuth instead
 * This is kept for backward compatibility
 */
import { useAuth as useAuthImpl } from '@/auth/hooks/useAuth';

export function useAuth() {
  console.warn('DEPRECATED: Using deprecated useAuth hook from /hooks. Use @/auth/hooks/useAuth instead.');
  return useAuthImpl();
}
