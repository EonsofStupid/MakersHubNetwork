
/**
 * useAuthAtoms.ts
 * 
 * Custom hook to provide convenient access to auth-related atoms
 * This establishes a clean boundary with read-only Jotai atoms derived from Zustand
 */

import { useAtom } from 'jotai';
import { 
  userAtom,
  profileAtom,
  rolesAtom,
  statusAtom,
  isAuthenticatedAtom,
  isAdminAtom,
  isSuperAdminAtom,
  hasRoleAtom,
  userNameAtom,
  userAvatarAtom,
  logoutAtom
} from '@/auth/atoms/auth.store.atoms';

/**
 * Custom hook that provides access to auth-related atoms
 * Follows the hybrid state pattern with Jotai atoms serving as read-only views
 * into the auth store state
 */
export function useAuthAtoms() {
  const [user] = useAtom(userAtom);
  const [profile] = useAtom(profileAtom);
  const [roles] = useAtom(rolesAtom);
  const [status] = useAtom(statusAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [isSuperAdmin] = useAtom(isSuperAdminAtom);
  const [userName] = useAtom(userNameAtom);
  const [userAvatar] = useAtom(userAvatarAtom);
  const [logout] = useAtom(logoutAtom);
  const [hasRole] = useAtom(hasRoleAtom);

  // Return all atoms in a single object
  // The consuming components should never directly modify these values
  return {
    user,
    profile,
    roles,
    status,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userName,
    userAvatar,
    logout,
    hasRole
  };
}
