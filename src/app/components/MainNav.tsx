
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { Button } from '@/shared/ui/button';
import { AuthStatus } from '@/shared/types/shared.types';

export default function MainNav() {
  const { isAuthenticated, logout, status, user } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-lg">
            Admin Dashboard
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            {RBACBridge.hasAdminAccess() && (
              <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
