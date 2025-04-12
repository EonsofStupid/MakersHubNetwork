
import { AuthProvider, useAuth } from './components/AuthProvider';
import { RequireAuth } from './components/RequireAuth';
import { RequirePermission } from './components/RequirePermission';
import { AdminOnly } from './components/AdminOnly';
import { GoogleLoginButton } from './components/GoogleLoginButton';
import { LinkedAccountAlert } from './components/LinkedAccountAlert';
import { AccountLinkingModal } from './components/AccountLinkingModal';
import { useAuthState } from './hooks/useAuthState';
import { useHasRole } from './hooks/useHasRole';
import { authBridge } from '@/bridges/AuthBridge';
import { UserMenu } from './components/UserMenu';
import { UserAvatar } from './components/UserAvatar';

// Hook for composing auth utilities
import { useAuthStore } from './store/auth.store';

// Utils
import { redirectIfAuthenticated, redirectIfUnauthenticated, redirectIfNotAdmin } from './utils/redirect';
import { hasRole } from './utils/hasRole';

export {
  AuthProvider,
  useAuth,
  RequireAuth,
  RequirePermission,
  AdminOnly,
  GoogleLoginButton,
  UserMenu,
  UserAvatar,
  LinkedAccountAlert,
  AccountLinkingModal,
  useAuthState,
  useHasRole,
  useAuthStore,
  authBridge,
  redirectIfAuthenticated,
  redirectIfUnauthenticated,
  redirectIfNotAdmin,
  hasRole
};
