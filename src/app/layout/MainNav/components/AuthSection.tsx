
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { UserMenu } from '@/auth/components/UserMenu';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthStatus } from '@/auth/types/auth.types';
import { useHasRole } from '@/auth/hooks/useHasRole';

export default function AuthSection() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { status, user } = useAuthStore();
  const { hasAdminAccess } = useHasRole();
  
  // Render the admin dashboard link only for users with admin access
  const renderAdminLink = () => {
    if (hasAdminAccess()) {
      return (
        <Link to="/admin" className="mr-4 hover:underline text-sm">
          Admin Dashboard
        </Link>
      );
    }
    return null;
  };
  
  // Show loading state
  if (status === AuthStatus.LOADING) {
    return (
      <div className="flex items-center">
        <Button variant="outline" size="sm" disabled>Loading...</Button>
      </div>
    );
  }
  
  // Show authenticated state
  if (status === AuthStatus.AUTHENTICATED && user) {
    return (
      <div className="flex items-center gap-2">
        {renderAdminLink()}
        <UserMenu />
      </div>
    );
  }
  
  // Show unauthenticated state
  return (
    <div className="flex items-center gap-2">
      <Link to="/auth/login">
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoggingIn}
        >
          Login
        </Button>
      </Link>
      <Link to="/auth/register">
        <Button 
          size="sm"
          disabled={isLoggingIn}
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
