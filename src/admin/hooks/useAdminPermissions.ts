
/**
 * @deprecated Use the implementation in useAdminPermissions.tsx instead
 * This file is maintained for backward compatibility and will be removed in a future release
 */
import { useAdminPermissions as useAdminPermissionsHook } from './useAdminPermissions.tsx';

/**
 * Legacy admin permissions hook that uses the admin store
 * @deprecated Use the main useAdminPermissions implementation from useAdminPermissions.tsx
 */
export function useAdminPermissions() {
  return useAdminPermissionsHook();
}
