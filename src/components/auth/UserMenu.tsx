
import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { UserRole } from '@/auth/types/userRoles';
import { useAuth } from '@/auth/hooks/useAuthStore';
import { commonSearchParamsSchema } from '@/router/searchParams';

export function UserMenuSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, isAuthenticated } = auth;
  
  // Check admin status safely
  const isAdmin = auth.roles?.includes(UserRole.ADMIN) || auth.roles?.includes(UserRole.SUPER_ADMIN) || false;
  
  const handleLogout = async () => {
    if (auth.logout) {
      await auth.logout();
      onOpenChange(false);
      navigate({ to: '/' });
    }
  };
  
  const navigateToProfile = () => {
    onOpenChange(false);
    navigate({ to: '/profile' });
  };
  
  const navigateToSettings = () => {
    onOpenChange(false);
    navigate({ to: '/settings' });
  };
  
  const navigateToAdmin = () => {
    onOpenChange(false);
    navigate({ to: '/admin/dashboard' });
  };
  
  const navigateToLogin = () => {
    onOpenChange(false);
    const search = commonSearchParamsSchema.parse({ 
      returnTo: window.location.pathname 
    });
    navigate({ 
      to: '/login', 
      search
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
          <SheetDescription>
            {isAuthenticated 
              ? `Logged in as ${user?.email || 'User'}`
              : 'You are not logged in'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={navigateToProfile}>
                Profile
              </Button>
              <Button variant="outline" onClick={navigateToSettings}>
                Settings
              </Button>
              {isAdmin && (
                <Button variant="outline" onClick={navigateToAdmin}>
                  Admin Panel
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={navigateToLogin} className="w-full">
              Log In
            </Button>
          )}
        </div>
        
        <SheetFooter>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
