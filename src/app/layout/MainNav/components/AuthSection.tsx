
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ChevronsLeft, ChevronsRight, Shield, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/utils/cn";
import { authBridge } from '@/auth/bridge';
import { useAuthStore } from "@/auth/store/auth.store";
import { Badge } from "@/shared/ui/badge";
import { useToast } from "@/shared/hooks/use-toast";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory, UserRole } from "@/shared/types/shared.types";
import { UserMenu } from '@/auth/components/UserMenu';
import { useHasRole } from "@/auth/hooks/useHasRole";

export const AuthSection = () => {
  const { toast } = useToast();
  const logger = useLogger('AuthSection', LogCategory.AUTH);
  const [open, setOpen] = useState(false);
  
  // Get auth status from centralized store
  const { user, status, profile, roles } = useAuthStore(state => ({
    user: state.user,
    status: state.status,
    profile: state.profile,
    roles: state.roles
  }));
  
  const { hasAdminAccess } = useHasRole();
  
  const isAuthenticated = status === 'AUTHENTICATED';
  const isLoading = status === 'LOADING';
  
  useEffect(() => {
    // Close the sheet when user logs in/out
    if (open && isAuthenticated) setOpen(false);
  }, [isAuthenticated, open]);
  
  // User element to display based on auth status
  const userElement = () => {
    if (isLoading) {
      return (
        <div className="w-9 h-9 rounded-full bg-muted/50 animate-pulse" />
      );
    }
    
    if (isAuthenticated && user) {
      const displayName = profile?.display_name || user.user_metadata?.full_name || user.email;
      const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
      
      // Get initials from name
      const getInitials = () => {
        if (!displayName) return "U";
        return displayName
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
      };
      
      return (
        <div className="flex items-center gap-2">
          {/* Admin badge if user has admin role */}
          {hasAdminAccess() && (
            <Link to="/admin" className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
              <Shield size={12} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          
          <UserMenu />
        </div>
      );
    }
    
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "rounded-full w-9 h-9 p-2",
              "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
          >
            <UserRound className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <div className="space-y-4 py-4">
            <h2 className="text-2xl font-bold text-center">Welcome</h2>
            <p className="text-center text-muted-foreground">Sign in to access all features</p>
            
            <div className="flex flex-col space-y-2 mt-6">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };
  
  return userElement();
};
