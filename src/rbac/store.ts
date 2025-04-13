
import { create } from 'zustand';
import { UserRole } from '@/shared/types/SharedTypes';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/SharedTypes';

/**
 * RBAC state interface
 */
interface RbacState {
  roles: UserRole[];
  
  // Role methods
  hasRole: (check: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Utility methods
  clear: () => void;
}

/**
 * RBAC store implementation
 * Manages roles and permissions separately from auth
 */
export const useRbacStore = create<RbacState>((set, get) => {
  const logger = useLogger('RbacStore', LogCategory.RBAC);
  
  return {
    roles: [],
    
    /**
     * Check if user has the specified role(s)
     */
    hasRole: (check: UserRole | UserRole[]) => {
      const { roles } = get();
      const checkRoles = Array.isArray(check) ? check : [check];
      return checkRoles.some(role => roles.includes(role));
    },
    
    /**
     * Set user roles
     */
    setRoles: (roles: UserRole[]) => {
      set({ roles });
      logger.info('Roles updated', { details: { roles } });
    },
    
    /**
     * Clear RBAC state
     */
    clear: () => {
      set({ roles: [] });
      logger.info('RBAC state cleared');
    }
  };
});
