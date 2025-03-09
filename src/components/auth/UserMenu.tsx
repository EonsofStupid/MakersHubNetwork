
import { useState, memo, useCallback, useMemo, useEffect } from "react" 
import { useAuthStore } from "@/stores/auth/store"
import { useToast } from "@/hooks/use-toast"
import { useAdminAccess } from "@/hooks/useAdminAccess"
import { ProfileDialog } from "@/components/profile/ProfileDialog"
import { UserMenuSheet } from "@/components/auth/UserMenuSheet"
import { useAdminPreferences } from "@/admin/store/adminPreferences.store"
import { useRouter } from "@tanstack/react-router"

export const UserMenu = memo(() => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()
  
  // Get data from store with selectors to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)
  
  // Admin preferences
  const { loadPreferences, setRouterPreference } = useAdminPreferences()
  
  // Check the current URL to determine which router to use
  useEffect(() => {
    const pathname = router.state.location.pathname
    // If we're on an admin page with path segments
    if (pathname.startsWith('/admin/')) {
      setRouterPreference('tanstack')
    }
    
    // Always load preferences when component mounts
    loadPreferences()
  }, [router.state.location.pathname, setRouterPreference, loadPreferences])
  
  // Memoize admin access check to prevent excessive store reads
  const { hasAdminAccess } = useAdminAccess()
  
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
      router.navigate({ to: '/' })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }, [logout, toast, router])

  // Memoize props to prevent object recreation on each render
  const sheetProps = useMemo(() => ({
    isOpen: isSheetOpen,
    onOpenChange: setSheetOpen,
    userEmail: user?.email,
    isLoadingLogout: isLoading,
    onShowProfile: handleOpenProfileDialog,
    onLogout: handleLogout,
    hasAdminAccess: hasAdminAccess,
    roles: roles
  }), [
    isSheetOpen, 
    user?.email, 
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
