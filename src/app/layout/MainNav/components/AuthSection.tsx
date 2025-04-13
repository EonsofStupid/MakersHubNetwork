
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserMenu } from '@/app/components/auth/UserMenu';
import { AuthSheet } from '@/app/components/auth/AuthSheet';

const AuthSection: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <AuthSheet />
      )}
    </div>
  );
};

export default AuthSection;
