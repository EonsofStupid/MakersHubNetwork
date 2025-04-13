
// Re-export all auth components and utilities
import { authBridge } from './bridge';
import { useAuthStore } from './store/auth.store';

// Export components
export { authBridge };
export { useAuthStore };

// Export types
export type { AuthBridge } from './bridge';

// Export components from app/components/auth that should be accessible
export { UserMenu } from '../app/components/auth/UserMenu';
export { UserMenuSheet } from '../app/components/auth/UserMenuSheet';
export { AuthSheet } from '../app/components/auth/AuthSheet';

// Re-export UserAvatar for convenience
export { UserAvatar } from '../shared/ui/UserAvatar';
