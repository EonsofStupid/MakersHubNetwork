
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/hooks/useAuth';
import { LogOut, Settings, User } from 'lucide-react';

export function TopNav() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-primary/30 bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-300">
              MakersImpulse
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-1 md:gap-2">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/explore" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Explore
            </Link>
            <Link to="/community" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Community
            </Link>
            {user && (
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
