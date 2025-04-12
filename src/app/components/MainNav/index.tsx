
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/shared/ui/navigation-menu';
import { Button } from '@/shared/ui/button';
import { UserMenu } from '@/auth/components/UserMenu';
import { useAuthStore } from '@/auth/store/auth.store';
import { SearchButton } from './components/SearchButton';

export function MainNav() {
  const navigate = useNavigate();
  const { status, isAuthenticated, isLoading } = useAuthStore();

  return (
    <div className="flex justify-between items-center py-3">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <Link 
              to="/"
              className={cn(
                "text-sm font-medium transition-colors",
                "hover:text-primary"
              )}
            >
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/features"
              className={cn(
                "text-sm font-medium transition-colors",
                "hover:text-primary"
              )}
            >
              Features
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/about"
              className={cn(
                "text-sm font-medium transition-colors",
                "hover:text-primary"
              )}
            >
              About
            </Link>
          </NavigationMenuItem>
          {isAuthenticated && (
            <NavigationMenuItem>
              <Button 
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary p-0"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center space-x-2">
        <SearchButton />
        {isLoading ? (
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        ) : isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
