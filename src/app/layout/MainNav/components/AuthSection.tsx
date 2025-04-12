
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ChevronsLeft, ChevronsRight, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/utils/cn";
import { authBridge } from '@/auth/bridge';
import { useAuthStore } from "@/auth/store/auth.store";
import { Badge } from "@/shared/ui/badge";
import { useToast } from "@/shared/hooks/use-toast";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";
import { UserMenu } from '@/auth/components/UserMenu';

export const AuthSection = () => {
  const { toast } = useToast();
  const logger = useLogger('AuthSection', LogCategory.AUTH);
  const [open, setOpen] = useState(false);
  
  // Get auth status from centralized store
  const { user, status, profile } = useAuthStore(state => ({
    user: state.user,
    status: state.status,
    profile: state.profile,
  }));
  
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
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-9 h-9 p-0 overflow-hidden border border-primary/20 hover:border-primary/50 hover:bg-primary/5"
          >
            <Avatar>
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
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
              "hover:bg-primary/10 hover:border-primary/30"
            )}
          >
            <UserRound className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] sm:w-[400px]">
          <div className="px-2 py-4 h-full flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Welcome</h3>
                <p className="text-muted-foreground text-sm">
                  Sign in to access your account
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                Guest
              </Badge>
            </div>
            
            <div className="space-y-4 flex flex-col flex-grow">
              <div className="space-y-2">
                <Button 
                  asChild
                  className="w-full justify-center"
                >
                  <Link to="/auth/login">Login</Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild
                  className="w-full justify-center"
                >
                  <Link to="/auth/register">Create Account</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between my-6">
                <div className="h-px bg-border flex-grow" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <div className="h-px bg-border flex-grow" />
              </div>
              
              <div className="flex-grow space-y-4">
                <Button 
                  variant="ghost"
                  className="justify-between w-full"
                  onClick={() => {
                    // Handle guest navigation
                  }}
                >
                  <span>Browse as Guest</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-between w-full"
                  onClick={() => {
                    // Navigate to support
                  }}
                >
                  <span>Help / Support</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };
  
  return isAuthenticated ? <UserMenu /> : userElement();
};
