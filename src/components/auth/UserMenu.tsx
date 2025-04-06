
import { useState, memo, useCallback, useMemo } from "react" 
import { useToast } from "@/hooks/use-toast"
import { ProfileDialog } from "@/components/profile/ProfileDialog"
import { UserMenuSheet } from "@/components/auth/UserMenuSheet"
import { useAuthState } from "@/auth/hooks/useAuthState"
import { useLogger } from "@/hooks/use-logger"
import { LogCategory } from "@/logging"
import { errorToObject } from "@/shared/utils/render"

export const UserMenu = memo(() => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const logger = useLogger("UserMenu", LogCategory.AUTH)
  
  // Get auth data from centralized hook
  // Important: Using useAuthState to avoid initialization cycles
  const { user, roles, logout, isAdmin } = useAuthState()
  
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

  // Logout handler - memoized to prevent recreation
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true)
      logger.info("User logging out")
      await logout()
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
  }, [logout, toast, logger])

  // Memoize props to prevent object recreation on each render
  const sheetProps = useMemo(() => ({
    isOpen: isSheetOpen,
    onOpenChange: setSheetOpen,
    userEmail: user?.email,
    isLoadingLogout: isLoading,
    onShowProfile: handleOpenProfileDialog,
    onLogout: handleLogout,
    hasAdminAccess: isAdmin(),
    roles: roles
  }), [
    isSheetOpen, 
    user?.email, 
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
