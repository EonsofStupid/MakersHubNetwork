import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/auth/hooks/useAuth';
import { Link } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { safeDetails } from '@/logging/utils/safeDetails';

export function UserMenu() {
  const { user, status, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const logger = useLogger('UserMenu', LogCategory.UI);
  
  useEffect(() => {
    if (status === 'authenticated') {
      logger.debug('User authenticated, rendering user menu', {
        details: {
          userId: user?.id,
          email: user?.email
        }
      });
    } else {
      logger.debug('No user authenticated, hiding user menu');
    }
  }, [status, user, logger]);
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      logger.error('Logout failed', { details: safeDetails(error) });
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.email as string} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <Icons.user className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isLoading} onClick={handleLogout}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <Icons.logout className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
