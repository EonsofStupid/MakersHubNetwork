
/**
 * useAuthAtoms.ts
 * 
 * Custom hook to provide convenient access to auth-related atoms
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
  logoutAtom,
  hasRoleAtom,
  userNameAtom,
  userAvatarAtom
} from '@/auth/atoms/auth.store.atoms';

/**
 * Custom hook that provides access to auth-related atoms
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
