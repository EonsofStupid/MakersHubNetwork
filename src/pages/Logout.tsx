
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/store';

export default function Logout() {
  const { logout } = useAuthStore();
  
  useEffect(() => {
    logout();
  }, [logout]);
  
  return <Navigate to="/" replace />;
}
