// Re-export all auth components and utilities
import { authBridge } from './lib/AuthBridgeImpl';
import { useAuthStore } from '@/stores/auth/auth.store';

// Export components
export { GoogleLoginButton } from './components/GoogleLoginButton';
export { LinkedAccountAlert } from './components/LinkedAccountAlert';
export { AccountLinkingModal } from './components/AccountLinkingModal';
export { UserMenu } from './components/UserMenu';
export { UserMenuSheet } from './components/UserMenuSheet';
export { RoleGate } from './components/RoleGate';
export { 
  withRoleProtection,
  withAdminProtection,
  withSuperAdminProtection,
  withModeratorProtection,
  withBuilderProtection,
  withAuthProtection
} from './components/WithRoleProtection';
export { AuthGuard } from './components/AuthGuard';

// Export bridge
export { authBridge };

// Export hooks
export { useAuthStore };

// Export utilities
export * from './utils/hasRole';
export * from './utils/redirect';
