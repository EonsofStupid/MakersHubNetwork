
/**
 * RBAC Module Entry Point
 * Provides centralized access to RBAC functionality with enterprise-level organization
 */

// Export core bridge as the main API
export { RBACBridge } from './bridge';
export { default as RBACBridge } from './bridge';

// Export RBAC initializer
export { RBACInitializer } from './RBACInitializer';

// Export types and constants
export { UserRole, ROLES, ROLE_GROUPS, ROLE_LABELS, ROLE_PRIORITY } from './constants/roles';
export { Permission } from '@/shared/types/permissions';
export { PATH_POLICIES, ADMIN_SECTION_POLICIES } from './constants/policies';

// Export components
export { RoleGuard, AdminGuard, SuperAdminGuard, ModeratorGuard, BuilderGuard, AuthGuard } from './components/RoleGuard';
export { RouteGuard, withRoleProtection } from './components/withRoleProtection';

// Export hooks
export { useRbac } from './hooks/useRbac';

// Export store for advanced usage
export { useRbacStore } from './store/rbac.store';

// Initialize the RBAC system on import
import { RBACBridge } from './bridge';
setTimeout(() => {
  RBACBridge.initialize();
}, 0);
