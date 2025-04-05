
import React, { useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAccess } from "@/hooks/useAdminAccess";

// Memoize the component to prevent unnecessary rerenders
export const AuthSection = memo(() => {
  const { user, logout } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  
  // Handle avatar click with animation and effects
  // Using useCallback to prevent recreating this function on each render
  const handleAvatarClick = useCallback(() => {
    const avatar = document.querySelector('.avatar-trigger');
    if (avatar) {
      avatar.classList.add('cyber-glow');
      setTimeout(() => {
        avatar.classList.remove('cyber-glow');
      }, 400);
    }
  }, []);
  
  // Handle logout with useCallback to prevent function recreation
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);
  
  // If logged in, show avatar with dropdown
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full p-0 w-8 h-8 avatar-trigger transition-all duration-300 hover:scale-110",
              "hover:shadow-[0_0_10px_rgba(0,240,255,0.7)]"
            )}
            onClick={handleAvatarClick}
          >
            <Avatar className="w-8 h-8 border border-primary/30">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 backdrop-blur-lg bg-background/80 border-primary/20">
          <div className="flex items-center justify-start p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm text-foreground">{user.user_metadata?.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          
          {hasAdminAccess && (
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  // If not logged in, show login button with animation effects
  return (
    <Link to="/login">
      <Button 
        variant="outline" 
        size="sm"
        className="site-border-glow cyber-effect-text group"
      >
        <span className="relative z-10">Login</span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
      </Button>
    </Link>
  );
});
