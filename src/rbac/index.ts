
/**
 * RBAC Module Entry Point
 * Provides centralized access to RBAC functionality
 */

// Export bridge as the main API
export { RBACBridge as default } from './bridge';
export { RBACBridge } from './bridge';

// Export types and constants
export { UserRole, ROLES, ROLE_GROUPS, ROLE_LABELS } from './constants/roles';
export { Permission } from './constants/permissions';
export { PATH_POLICIES } from './constants/policies';

// Export store for advanced usage
export { rbacStore, useRbacStore } from './store/rbac.store';

// Initialize the RBAC system
import { RBACBridge } from './bridge';
setTimeout(() => {
  RBACBridge.initialize();
}, 0);
