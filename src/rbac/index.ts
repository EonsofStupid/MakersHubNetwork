
/**
 * RBAC Module Entry Point
 * Provides centralized access to RBAC functionality with enterprise-level organization
 */

// Export core bridge as the main API
export { RBACBridge } from './bridge';

// Export RBAC initializer
export { RBACInitializer } from './RBACInitializer';

// Export types and constants
export { UserRole, ROLES, RBAC } from '@/shared/types/shared.types';
export { Permission } from '@/shared/types/permissions';

// Export hooks
export { useRbac } from './hooks/useRbac';
