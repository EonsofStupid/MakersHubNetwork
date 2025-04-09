
import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { showAdminButtonAtom, showAdminWrenchAtom } from "@/admin/atoms/ui.atoms";
import { Wrench, User, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginSheet } from "./LoginSheet";
import { ComponentWrapper } from "@/admin/components/debug/ComponentWrapper";
import { useAuthStore, selectUser, selectIsAuthenticated } from "@/auth/store/auth.store";

/**
 * AuthSection Component
 * 
 * Displays authentication controls in the MainNav, including:
 * - Login/Avatar button
 * - Admin access links (when authorized)
 * 
 * Uses Zustand for state management with selectors for performance.
 */
export const AuthSection: React.FC = () => {
  // Use Zustand with selectors to minimize re-renders
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(state => state.isAdmin());
  const isSuperAdmin = useAuthStore(state => state.isSuperAdmin());
  
  // Local UI state
  const [showAdminButton] = useAtom(showAdminButtonAtom);
  const [showAdminWrench] = useAtom(showAdminWrenchAtom);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Memoized values to prevent recalculations
  const hasAdminAccess = useMemo(() => isAdmin, [isAdmin]);
  const avatarUrl = useMemo(() => user?.user_metadata?.avatar_url as string | undefined, [user]);
  const userInitial = useMemo(() => (user?.email?.charAt(0).toUpperCase() || 'U') as string, [user]);
  
  // Memoized handlers to prevent recreating functions
  const handleOpenLogin = useCallback(() => setIsLoginOpen(true), []);
  const handleCloseLogin = useCallback(() => setIsLoginOpen(false), []);

  return (
    <ComponentWrapper componentName="AuthSection" className="flex items-center gap-2">
      {/* Only show Admin button if user has admin access */}
      {hasAdminAccess && showAdminButton && (
        <ComponentWrapper componentName="AdminButton">
          <Link to="/admin">
            <Button 
              variant="outline" 
              size="sm"
              className="site-border-glow cyber-effect-text group"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span className="relative z-10">Admin</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
            </Button>
          </Link>
        </ComponentWrapper>
      )}
      
      {/* Only show Admin wrench if user has admin access */}
      {hasAdminAccess && showAdminWrench && (
        <ComponentWrapper componentName="AdminWrench">
          <Link to="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="relative ml-2 text-primary hover:text-white hover:bg-primary/20"
              aria-label="Admin Dashboard"
            >
              <Wrench className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
            </Button>
          </Link>
        </ComponentWrapper>
      )}

      {/* Avatar Login Button with Cyberpunk Effect */}
      <ComponentWrapper componentName="UserAvatar">
        {isAuthenticated ? (
          <Avatar 
            className="h-8 w-8 border-2 border-primary/50 hover:border-primary transition-all duration-300 cursor-pointer site-glow-hover cyber-effect-text"
            onClick={handleOpenLogin}
          >
            <AvatarImage src={avatarUrl} alt="User avatar" />
            <AvatarFallback className="bg-primary/20 text-primary">
              {userInitial}
            </AvatarFallback>
            {isSuperAdmin && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-secondary rounded-full animate-pulse"></span>
            )}
          </Avatar>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-2 border-primary/40 text-primary bg-background/40 hover:bg-primary/20 cyber-effect-text site-glow-hover"
            onClick={handleOpenLogin}
          >
            <User className="h-4 w-4" />
            <span>Login</span>
          </Button>
        )}
      </ComponentWrapper>

      {/* Login Sheet with all auth options */}
      <LoginSheet 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />
    </ComponentWrapper>
  );
};
