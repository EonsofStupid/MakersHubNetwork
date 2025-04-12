
import { useEffect, useState } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { useAuthStore } from '@/auth/store/auth.store';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { roles } = useAuthStore();

  useEffect(() => {
    // Check if user has admin role
    const checkAdminRole = () => {
      if (roles.includes('admin') || roles.includes('superadmin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminRole();

    // Subscribe to auth events
    const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', () => {
      checkAdminRole();
    });

    return () => {
      unsubscribe();
    };
  }, [roles]);

  return {
    isAdmin
  };
};
