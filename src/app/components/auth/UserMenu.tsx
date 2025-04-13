
import { useState, memo, useCallback } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { UserAvatar } from "@/shared/ui/UserAvatar";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";
import { authBridge } from "@/auth/bridge";
import { RBACBridge } from "@/rbac/bridge";
import { Button } from "@/shared/ui/button";
import { UserMenuSheet } from "./UserMenuSheet";
import { useAuthStore } from "@/auth/store/auth.store";

export function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const logger = useLogger("UserMenu", LogCategory.AUTH);
  
  // Get auth data from centralized store
  const user = useAuthStore(state => state.user);
  const roles = RBACBridge.getRoles();
  
  // Handle opening the user menu
  const handleOpenUserMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);
  
  // Handle profile
  const handleShowProfile = useCallback(() => {
    setIsMenuOpen(false);
    // Navigate to profile page if needed
  }, []);
  
  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      logger.info("User logging out");
      await authBridge.signOut();
      logger.info("User logged out successfully");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      logger.error("Error logging out", { details: { message: error?.message } });
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    }
  }, [toast, logger]);

  // Don't render if no user
  if (!user) {
    return null;
  }

  // Get display name and email from user
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const userAvatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <>
      <Button
        onClick={handleOpenUserMenu}
        variant="ghost"
        className="rounded-full p-1 transition hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="User menu"
      >
        <UserAvatar user={user} size="sm" />
      </Button>
      
      <UserMenuSheet
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        userDisplayName={displayName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        onShowProfile={handleShowProfile}
        onLogout={handleLogout}
        roles={roles}
      />
    </>
  );
}
