
import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { Loader2, LogOut, Settings, User, Shield, ChevronDown } from 'lucide-react';

export function AuthSection() {
  const navigate = useNavigate();
  const { user, status, logout, isAdmin } = useAuthState();
  
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;
  
  // Handle login button click
  const handleLoginClick = () => {
    navigate({ to: '/login' });
  };
  
  // Handle logout button click
  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Handle profile button click
  const handleProfileClick = () => {
    navigate({ to: '/profile' });
  };
  
  // Handle settings button click
  const handleSettingsClick = () => {
    navigate({ to: '/settings' });
  };
  
  // Handle admin button click
  const handleAdminClick = () => {
    navigate({ to: '/admin/dashboard' });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-muted"></div>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLoginClick}
          className="hidden sm:flex"
        >
          Log In
        </Button>
      </div>
    );
  }
  
  // Authenticated state
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url || undefined} alt={user.display_name || 'User'} />
            <AvatarFallback>{getNameInitials(user.display_name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.display_name}</p>
          <p className="text-xs leading-none text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {isAdmin() && (
          <DropdownMenuItem onClick={handleAdminClick}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogoutClick}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to get initials from name
function getNameInitials(name?: string | null): string {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
