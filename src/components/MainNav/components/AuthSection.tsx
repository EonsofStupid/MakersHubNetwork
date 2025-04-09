
import React, { useState, useMemo, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { validateAdminPath } from '@/admin/utils/adminRoutes';
import { cn } from '@/lib/utils';
import CircuitBreaker from '@/utils/CircuitBreaker';

interface AuthSectionProps {
  className?: string;
}

// Use React.memo to prevent unnecessary re-renders
const AuthSection = memo(function AuthSection({ className }: AuthSectionProps) {
  // Initialize circuit breaker for this component
  CircuitBreaker.init('auth-section', 3, 1000);
  
  // Use stable references to auth values to prevent unnecessary re-renders
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get auth state with explicit destructuring to avoid object spreading
  const auth = useAuth();
  const { user, isAdmin, logout, isAuthenticated, status } = auth;
  
  // Memoize avatar info to prevent unnecessary re-renders
  const avatarInfo = useMemo(() => {
    if (!user) return { url: '', fallback: '?' };
    
    return {
      url: user.user_metadata?.avatar_url || '',
      fallback: (user.user_metadata?.display_name || user.email || '?')
        .charAt(0)
        .toUpperCase()
    };
  }, [user]);
  
  // Skip rendering while auth is initializing
  if (CircuitBreaker.isTripped('auth-section')) {
    console.warn('CircuitBreaker detected potential infinite loop in AuthSection');
    return null; // Don't render anything to break potential loops
  }
  
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'There was an issue logging out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, toast, navigate]);

  // For non-authenticated users, show login button
  if (!isAuthenticated || !user) {
    return (
      <div className={cn("flex gap-4 items-center", className)}>
        <Button variant="outline" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  // User is authenticated, show the profile menu
  return (
    <div className={cn("flex gap-4 items-center", className)}>
      {isAdmin && (
        <Button 
          variant="outline" 
          onClick={() => navigate(validateAdminPath('/admin/dashboard'))}
        >
          Admin
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={avatarInfo.url} 
                alt={user.user_metadata?.display_name || user.email || ''}
              />
              <AvatarFallback>{avatarInfo.fallback}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata?.display_name || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export { AuthSection };
