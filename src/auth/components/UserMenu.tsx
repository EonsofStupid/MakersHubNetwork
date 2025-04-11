
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/core/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/core/avatar';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
import { User } from '@/shared/types/shared.types';
import { authBridge } from '@/bridges';
import { useAuthState } from '../hooks/useAuthState';

export function UserMenu() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthState();
  
  if (!user) return null;
  
  const handleLogout = async () => {
    try {
      await authBridge.logout();
      navigate('/');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const displayName = user.user_metadata?.name || user.user_metadata?.full_name || user.email || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 rounded-full hover:bg-accent p-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="font-normal text-sm">{displayName}</span>
            <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
