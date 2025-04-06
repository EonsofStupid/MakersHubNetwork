
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth.unified';

interface AdminAccess {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasAdminAccess: boolean;
}

export function useAdminAccess(): AdminAccess {
  const { roles, user, status } = useAuth();
  const [adminAccess, setAdminAccess] = useState<AdminAccess>({
    isAdmin: false,
    isSuperAdmin: false,
    hasAdminAccess: false,
  });

  useEffect(() => {
    const isAdmin = roles.includes('admin' as UserRole);
    const isSuperAdmin = roles.includes('super_admin' as UserRole);
    const hasAdminAccess = isAdmin || isSuperAdmin;

    setAdminAccess({
      isAdmin,
      isSuperAdmin,
      hasAdminAccess,
    });
  }, [roles, user, status]);

  return adminAccess;
}
