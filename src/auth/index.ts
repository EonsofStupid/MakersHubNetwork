
// Export interfaces
export * from './bridge';

// Export hooks
export { useAuthStore } from './store/auth.store';

// Export components
export { RoleGate, AdminGate, SuperAdminGate } from './components/RoleGate';

// Export RBAC Bridge
export { RBACBridge } from '@/rbac/bridge';
