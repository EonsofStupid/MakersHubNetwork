
import { useAuth as useAuthFromContext } from '@/auth/context/AuthContext';
import { AuthStore } from '@/auth/types/auth.types';

// Re-export the hook for consistency with proper typing
export const useAuth = (): AuthStore => useAuthFromContext();
