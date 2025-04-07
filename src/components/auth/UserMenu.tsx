
import React from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User, ShieldCheck } from 'lucide-react';

export function UserMenu() {
  const { user, session, status, hasRole } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    const profile = user.profile as Record<string, string> | undefined;
    const displayName = profile?.displayName || user.email;
    
    if (!displayName) return 'U';
    
    if (displayName.includes('@')) {
      return displayName.substring(0, 2).toUpperCase();
    }
    
    const names = displayName.split(' ');
    return names.length > 1
      ? (names[0][0] + names[1][0]).toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  };

  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const profile = user.profile as Record<string, string> | undefined;
  const avatarUrl = profile?.avatarUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl || ''} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({ to: '/profile' as any })}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: '/settings' as any })}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => navigate({ to: '/admin/dashboard' as any })}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
