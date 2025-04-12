
// Re-export all auth components and utilities
import { authBridge } from './bridge';
import { useAuthStore } from './store/auth.store';

// Export components
export { GoogleLoginButton } from './components/GoogleLoginButton';
export { LinkedAccountAlert } from './components/LinkedAccountAlert';
export { AccountLinkingModal } from './components/AccountLinkingModal';
export { UserMenu } from './components/UserMenu';
export { UserMenuSheet } from './components/UserMenuSheet';
export { AdminOnly } from './components/AdminOnly';
export { RequireAuth } from './components/RequireAuth';
export { RequirePermission } from './components/RequirePermission';

// Export bridge
export { authBridge };

// Export hooks
export { useAuthStore };

// Export utilities
export * from './utils/hasRole';
export * from './utils/redirect';
