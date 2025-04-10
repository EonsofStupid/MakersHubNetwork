
import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { showAdminButtonAtom, showAdminWrenchAtom } from "@/admin/atoms/ui.atoms";
import { Wrench, User, Shield, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginSheet } from "./LoginSheet";
import { ComponentWrapper } from "@/admin/components/debug/ComponentWrapper";
import { useAuthStore } from "@/auth/store/auth.store";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { useHasAdminAccess, useIsSuperAdmin } from "@/auth/hooks/useHasRole";

/**
 * AuthSection Component
 * 
 * Displays authentication controls in the MainNav, including:
 * - Login/Avatar button
 * - Admin access links (when authorized)
 */
export const AuthSection: React.FC = () => {
  // Use Zustand with selectors to minimize re-renders
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const roles = useAuthStore(state => state.roles);
  
  // Use our role checking hooks
  const hasAdminAccess = useHasAdminAccess();
  const isSuperAdmin = useIsSuperAdmin();
  
  // Local UI state
  const [showAdminButton, setShowAdminButton] = useAtom(showAdminButtonAtom);
  const [showAdminWrench, setShowAdminWrench] = useAtom(showAdminWrenchAtom);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const logger = useLogger("AuthSection", LogCategory.AUTH);

  React.useEffect(() => {
    // Make sure admin buttons are visible if the user has admin access
    if (hasAdminAccess || isSuperAdmin) {
      setShowAdminButton(true);
      setShowAdminWrench(true);
      
      // Log the admin status for debugging
      logger.info('Admin user detected', { 
        details: { 
          userId: user?.id,
          hasAdminAccess,
          isSuperAdmin,
          roles
        }
      });
    }
  }, [hasAdminAccess, isSuperAdmin, user?.id, roles, setShowAdminButton, setShowAdminWrench, logger]);

  // Memoized values to prevent recalculations
  const avatarUrl = useMemo(() => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url as string | undefined;
  }, [profile?.avatar_url, user?.user_metadata?.avatar_url]);
  
  const userInitial = useMemo(() => {
    return (user?.email?.charAt(0).toUpperCase() || 'U') as string;
  }, [user?.email]);
  
  const displayName = useMemo(() => {
    return profile?.display_name || user?.user_metadata?.full_name || user?.email || 'User';
  }, [profile?.display_name, user?.user_metadata?.full_name, user?.email]);
  
  // Memoized handlers to prevent recreating functions on each render
  const handleOpenLogin = useCallback(() => {
    logger.info("Opening login sheet");
    setIsLoginOpen(true);
  }, [logger]);
  
  const handleCloseLogin = useCallback(() => {
    logger.info("Closing login sheet");
    setIsLoginOpen(false);
  }, [logger]);

  const isLoading = status === 'loading';

  return (
    <ComponentWrapper componentName="AuthSection" className="flex items-center gap-2">
      {/* Show Admin button if user has admin access */}
      {hasAdminAccess && (
        <ComponentWrapper componentName="AdminButton">
          <Link to="/admin">
            <Button 
              variant="outline" 
              size="sm"
              className="site-border-glow cyber-effect-text group"
            >
              {isSuperAdmin ? (
                <Crown className="mr-2 h-4 w-4 text-secondary" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              <span className="relative z-10">
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
            </Button>
          </Link>
        </ComponentWrapper>
      )}
      
      {/* Show Admin wrench if user has admin access */}
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
              {isSuperAdmin && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-secondary rounded-full animate-pulse"></span>
              )}
            </Button>
          </Link>
        </ComponentWrapper>
      )}

      {/* Avatar Login Button with Cyberpunk Effect */}
      <ComponentWrapper componentName="UserAvatar">
        {isLoading ? (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 border-primary/40 text-primary bg-background/40"
            disabled
          >
            <span className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full"></span>
            <span>Loading</span>
          </Button>
        ) : isAuthenticated ? (
          <Avatar 
            className="h-8 w-8 border-2 border-primary/50 hover:border-primary transition-all duration-300 cursor-pointer site-glow-hover cyber-effect-text"
            onClick={handleOpenLogin}
            title={displayName}
          >
            <AvatarImage src={avatarUrl} alt={displayName} />
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
