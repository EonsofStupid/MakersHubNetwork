
import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useAdminSidebar } from '../hooks/useAdminSidebar';
import { cn } from '@/shared/utils/cn';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserAvatar } from '@/shared/ui/user-avatar';

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Admin Dashboard" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toggle: toggleSidebar } = useAdminSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigateToSection = (path: string) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r border-primary/10">
            {/* Mobile sidebar content */}
          </SheetContent>
        </Sheet>
        <Button
          variant="ghost"
          className="hidden lg:flex"
          size="icon"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        {title && (
          <h1 className="text-xl font-semibold">{title}</h1>
        )}
      </div>

      {/* User menu */}
      <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group flex items-center gap-2 rounded-full px-2"
          >
            <UserAvatar
              user={user}
              fallbackText={user?.user_metadata?.full_name?.charAt(0) || 'U'}
              size="sm"
              className="h-8 w-8"
            />
            <span className="hidden text-sm font-medium md:inline-block">
              {user?.user_metadata?.full_name || 'Admin User'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                userMenuOpen && 'rotate-180'
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigateToSection('/admin/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
