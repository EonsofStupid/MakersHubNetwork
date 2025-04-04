
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-level';

export type UserRole = 
  | 'admin'
  | 'superadmin'
  | 'moderator'
  | 'editor'
  | 'user';

export interface UseAdminResult {
  roles: UserRole[];
  isAdmin: boolean;
  isSuperAdmin: boolean;  // Added missing property
  isModerator: boolean;
  isEditor: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (checkRoles: string[]) => boolean;
  getHighestRole: () => UserRole | null;
  isLoading: boolean;
}

/**
 * Hook to manage admin permissions and roles
 */
export const useAdmin = (): UseAdminResult => {
  const { user, isLoading } = useAuth();
  const logger = useLogger('useAdmin', { category: LogCategory.ADMIN });
  
  // Get user roles from the user object
  const roles: UserRole[] = user?.app_metadata?.roles || [];
  
  // Check if user has any of the admin roles
  const isAdmin = roles.includes('admin');
  const isSuperAdmin = roles.includes('superadmin');
  const isModerator = roles.includes('moderator');
  const isEditor = roles.includes('editor');
  
  // Function to check if user has a specific role
  const hasRole = (role: string): boolean => {
    return roles.includes(role as UserRole);
  };
  
  // Function to check if user has any of the specified roles
  const hasAnyRole = (checkRoles: string[]): boolean => {
    return checkRoles.some(role => hasRole(role));
  };
  
  // Get highest role based on hierarchy
  const getHighestRole = (): UserRole | null => {
    if (isSuperAdmin) return 'superadmin';
    if (isAdmin) return 'admin';
    if (isModerator) return 'moderator';
    if (isEditor) return 'editor';
    if (roles.includes('user')) return 'user';
    return null;
  };
  
  return {
    roles,
    isAdmin,
    isSuperAdmin,
    isModerator,
    isEditor,
    hasRole,
    hasAnyRole,
    getHighestRole,
    isLoading
  };
};

export default useAdmin;
