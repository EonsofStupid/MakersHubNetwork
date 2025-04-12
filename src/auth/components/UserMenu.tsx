
import { useState, memo, useCallback, useMemo } from "react" 
import { useToast } from "@/shared/hooks/use-toast"
import { ProfileDialog } from "@/app/profile/ProfileDialog"
import { UserMenuSheet } from "./UserMenuSheet"
import { useAuthStore } from "@/auth/store/auth.store"
import { useLogger } from "@/hooks/use-logger"
import { LogCategory } from "@/shared/types/shared.types"
import { errorToObject } from "@/shared/utils/render"
import { authBridge } from "@/auth/bridge"

export const UserMenu = memo(() => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const logger = useLogger("UserMenu", LogCategory.AUTH)
  
  // Get auth data from centralized store using selectors for performance
  const user = useAuthStore(state => state.user)
  const profile = useAuthStore(state => state.profile)
  const roles = useAuthStore(state => state.roles)
  
  // Memoize handlers to prevent recreating functions on each render
  const handleOpenSheet = useCallback(() => {
    setSheetOpen(true)
  }, [])
  
  const handleCloseSheet = useCallback(() => {
    setSheetOpen(false)
  }, [])
  
  const handleOpenProfileDialog = useCallback(() => {
    setSheetOpen(false)
    setProfileDialogOpen(true)
  }, [])
  
  const handleCloseProfileDialog = useCallback(() => {
    setProfileDialogOpen(false)
  }, [])

  // Get isAdmin function from authBridge to ensure consistent role checks
  const isAdmin = useCallback(() => {
    return authBridge.hasRole(['admin', 'super_admin'])
  }, [])

  // Logout handler - memoized to prevent recreation
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true)
      logger.info("User logging out")
      await authBridge.signOut()
      logger.info("User logged out successfully")
      window.location.reload()
    } catch (error) {
      logger.error("Error logging out", { details: errorToObject(error) })
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, logger])

  // Memoize props to prevent object recreation on each render
  const sheetProps = useMemo(() => ({
    isOpen: isSheetOpen,
    onOpenChange: setSheetOpen,
    userEmail: user?.email,
    userDisplayName: profile?.display_name || user?.user_metadata?.full_name,
    userAvatar: profile?.avatar_url || user?.user_metadata?.avatar_url,
    isLoadingLogout: isLoading,
    onShowProfile: handleOpenProfileDialog,
    onLogout: handleLogout,
    hasAdminAccess: isAdmin(),
    roles: roles
  }), [
    isSheetOpen, 
    user, 
    profile,
    isLoading, 
    handleOpenProfileDialog, 
    handleLogout, 
    isAdmin, 
    roles
  ])
  
  const profileDialogProps = useMemo(() => ({
    open: isProfileDialogOpen,
    onClose: handleCloseProfileDialog
  }), [isProfileDialogOpen, handleCloseProfileDialog])

  // Don't render if no user
  if (!user) {
    return null;
  }

  return (
    <>
      <UserMenuSheet {...sheetProps} />
      <ProfileDialog {...profileDialogProps} />
    </>
  )
})

UserMenu.displayName = "UserMenu"
