
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from '@/auth/hooks/useAuthState';

export function MainNav() {
  const { isAuthenticated, user } = useAuthState();

  return (
    <header className="relative z-40 bg-background/80 backdrop-blur-lg py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="cyber-logo text-2xl font-heading">
          Impulse 3D
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/parts" className="text-foreground hover:text-primary transition-colors">Parts</Link>
          <Link to="/builds" className="text-foreground hover:text-primary transition-colors">Builds</Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hello, {user?.email?.split('@')[0] || 'User'}</span>
              <button 
                className="bg-primary/10 text-primary px-4 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
              >
                Dashboard
              </button>
            </div>
          ) : (
            <button 
              className="bg-primary/10 text-primary px-4 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
