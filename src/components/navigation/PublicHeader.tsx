
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';

export function PublicHeader() {
  const { isAuthenticated } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  
  return (
    <header className="py-4 border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Impulsivity
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          
          {hasAdminAccess && (
            <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          )}
          
          {isAuthenticated ? (
            <Button variant="outline" asChild>
              <Link to="/account">Account</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
