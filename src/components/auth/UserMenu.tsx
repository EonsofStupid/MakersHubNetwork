
import { useState, memo, useCallback, useMemo, useEffect } from "react" 
import { useAuthStore } from "@/stores/auth/store"
import { useToast } from "@/hooks/use-toast"
import { useAdminAccess } from "@/hooks/useAdminAccess"
import { ProfileDialog } from "@/components/profile/ProfileDialog"
import { UserMenuSheet } from "@/components/auth/UserMenuSheet"
import { useAdminPreferences } from "@/admin/store/adminPreferences.store"
import { useLocation } from "react-router-dom"

export const UserMenu = memo(() => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const location = useLocation()
  
  // Get data from store with selectors to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)
  
  // Admin preferences
  const { loadPreferences, setRouterPreference } = useAdminPreferences()
  
  // Check the current URL to determine which router to use
  useEffect(() => {
    // Always load preferences when component mounts
    loadPreferences()
    
    const pathname = location.pathname
    // If we're on an admin page with path segments (not just tab query params)
    if (pathname.startsWith('/admin/')) {
      console.log('Setting router preference to tanstack');
      setRouterPreference('tanstack')
    }
  }, [location.pathname, setRouterPreference, loadPreferences])
  
  // Memoize admin access check to prevent excessive store reads
  const { hasAdminAccess } = useAdminAccess()
  
  const userEmail = user?.email
  
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
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      window.location.href = "/"
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }, [logout, toast])

  // Memoize props to prevent object recreation on each render
  const sheetProps = useMemo(() => ({
    isOpen: isSheetOpen,
    onOpenChange: setSheetOpen,
    userEmail: userEmail,
    isLoadingLogout: isLoading,
    onShowProfile: handleOpenProfileDialog,
    onLogout: handleLogout,
    hasAdminAccess: hasAdminAccess,
    roles: roles
  }), [
    isSheetOpen, 
    userEmail, 
    isLoading, 
    handleOpenProfileDialog, 
    handleLogout, 
    hasAdminAccess, 
    roles
  ])
  
  const profileDialogProps = useMemo(() => ({
    open: isProfileDialogOpen,
    onClose: handleCloseProfileDialog
  }), [isProfileDialogOpen, handleCloseProfileDialog])

  return (
    <>
      <UserMenuSheet {...sheetProps} />
      <ProfileDialog {...profileDialogProps} />
    </>
  )
})
