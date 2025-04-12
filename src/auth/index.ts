
// Export auth components
export { GoogleLoginButton } from './components/GoogleLoginButton';
export { LinkedAccountAlert } from './components/LinkedAccountAlert';
export { RequireAuth } from './components/RequireAuth';
export { AccountLinkingModal } from './components/AccountLinkingModal';
export { UserAvatar } from './components/UserAvatar';
export { UserMenu } from './components/UserMenu';

// Export hooks
export { useHasRole, useHasAdminAccess, useIsSuperAdmin } from './hooks/useHasRole';

// Export store
export { useAuthStore } from './store/auth.store';

// Export bridge
export { authBridge, subscribeToAuthEvents } from './bridge';
