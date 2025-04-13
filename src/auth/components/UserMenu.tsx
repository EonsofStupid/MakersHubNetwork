
import { useState, memo, useCallback } from "react" 
import { useToast } from "@/shared/ui/use-toast"
import { UserMenuSheet } from "./UserMenuSheet"
import { useAuthStore } from "@/auth/store/auth.store"
import { useLogger } from "@/hooks/use-logger"
import { LogCategory } from "@/shared/types/SharedTypes"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { authBridge } from "@/auth/bridge"

export const UserMenu = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()
  const logger = useLogger("UserMenu", LogCategory.AUTH)
  
  // Get auth data from centralized store
  const user = useAuthStore(state => state.user)
  const roles = useAuthStore(state => state.roles || [])
  
  // Handle opening the user menu
  const handleOpenUserMenu = useCallback(() => {
    setIsMenuOpen(true)
  }, [])
  
  // Handle profile
  const handleShowProfile = useCallback(() => {
    setIsMenuOpen(false)
    // Navigate to profile page if needed
  }, [])
  
  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      logger.info("User logging out")
      await authBridge.signOut()
      logger.info("User logged out successfully")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      window.location.reload()
    } catch (error) {
      logger.error("Error logging out", { error })
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      })
    }
  }, [toast, logger])

  // Don't render if no user
  if (!user) {
    return null
  }

  // Get display name and email from user
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <>
      <button
        onClick={handleOpenUserMenu}
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="User menu"
      >
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
      </button>
      
      <UserMenuSheet
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        userDisplayName={displayName}
        userEmail={user.email}
        userAvatar={avatarUrl}
        onShowProfile={handleShowProfile}
        onLogout={handleLogout}
        roles={roles}
      />
    </>
  )
})

UserMenu.displayName = "UserMenu"
