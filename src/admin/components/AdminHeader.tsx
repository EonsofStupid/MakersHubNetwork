
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogOut, Sun, Moon, User, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdminTooltip } from './ui/AdminTooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/components/ui/theme-provider';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = 'Dashboard' }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const typedUser = user as UserType | null;
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const displayName = typedUser?.user_metadata?.name || typedUser?.email || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className={cn(
      "h-16 border-b border-[var(--impulse-border-normal)]",
      "bg-[var(--impulse-bg-header)] px-4 flex items-center justify-between"
    )}>
      {/* Title */}
      <h1 className="text-xl font-heading text-[var(--impulse-text-primary)]">
        {title}
      </h1>
      
      {/* Actions */}
      <div className="flex items-center space-x-1">
        {/* Theme toggle */}
        <AdminTooltip content={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-[var(--impulse-bg-hover)]"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </AdminTooltip>
        
        {/* Notifications */}
        <AdminTooltip content="Notifications">
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-[var(--impulse-bg-hover)]">
            <Bell className="h-5 w-5" />
          </button>
        </AdminTooltip>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 rounded-full hover:bg-[var(--impulse-bg-hover)] p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={typedUser?.user_metadata?.avatar_url} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <span className="font-normal text-sm">{displayName}</span>
                <span className="text-xs font-normal text-muted-foreground">{typedUser?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
