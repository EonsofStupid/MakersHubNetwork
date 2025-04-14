
/**
 * Auth-RBAC Synchronization Module
 * Responsible for keeping auth and RBAC state in sync
 */
import { UserRole } from '@/rbac';
import { RBACBridge } from '@/rbac';
import { authBridge } from '@/auth/bridge';
import { logger } from '@/logging/logger.service';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

/**
 * Sync roles from auth state to RBAC
 * @param roles User roles from auth state
 */
export function syncRolesToRBAC(roles: UserRole[]): void {
  try {
    RBACBridge.setRoles(roles);
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'Roles synced to RBAC from auth', {
      details: { roles }
    });
  } catch (error) {
    logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Failed to sync roles to RBAC', {
      details: { error }
    });
  }
}

/**
 * Sync user profile after login
 * @param userId User ID
 */
export async function syncUserProfileAfterLogin(userId: string): Promise<void> {
  try {
    const user = authBridge.getUser();
    
    // If user has roles in profile, sync them to RBAC
    if (user && user.roles && Array.isArray(user.roles)) {
      syncRolesToRBAC(user.roles);
    }
    
    logger.log(LogLevel.INFO, LogCategory.AUTH, 'User profile synced after login', {
      details: { userId }
    });
  } catch (error) {
    logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Failed to sync user profile after login', {
      details: { error, userId }
    });
  }
}

/**
 * Clear RBAC state on logout
 */
export function clearRBACOnLogout(): void {
  try {
    RBACBridge.clearRoles();
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, 'RBAC state cleared on logout');
  } catch (error) {
    logger.log(LogLevel.ERROR, LogCategory.RBAC, 'Failed to clear RBAC state on logout', {
      details: { error }
    });
  }
}
