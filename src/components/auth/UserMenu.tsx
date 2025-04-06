
import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useAuthActions } from '@/auth/hooks/useAuthActions'; // Add this import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserMenu() {
  const { user, isAuthenticated } = useAuthState();
  const { logout } = useAuthActions(); // Get logout from actions
  const navigate = useNavigate();
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };
  
  // Check if user has admin role - implement separately from state
  const isAdmin = () => {
    const authState = useAuthState();
    return authState.roles.some(role => role === 'admin' || role === 'super_admin');
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={() => navigate({ to: '/login' })}>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || 'User'} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
          Settings
        </DropdownMenuItem>
        {isAdmin() && (
          <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            if (logout) logout();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
