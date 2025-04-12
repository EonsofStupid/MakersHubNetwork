
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/constants/log-category';
import { Button } from '@/shared/ui/button';
import { authBridge } from '@/auth/bridge';
import { useAuthStore } from '../store/auth.store';
import { UserAvatar } from './UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function UserMenu() {
  const navigate = useNavigate();
  const logger = useLogger('UserMenu', LogCategory.AUTH);
  const { user, roles } = useAuthStore();
  
  // Display name fallback hierarchy: displayName -> username -> email -> 'User'
  const displayName = 
    user?.profile?.display_name || 
    user?.profile?.username || 
    (user?.email ? user.email.split('@')[0] : 'User');
  
  const handleSignOut = async () => {
    try {
      await authBridge.signOut();
      navigate('/');
    } catch (error) {
      logger.error('Error signing out', { details: { error } });
    }
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };
  
  const handleAdminClick = () => {
    navigate('/admin');
  };
  
  const isAdmin = roles?.includes('admin') || roles?.includes('super_admin');
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserAvatar user={user} size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDashboardClick}>
          Dashboard
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={handleAdminClick}>
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
