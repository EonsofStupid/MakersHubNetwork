
import { useState } from "react"
import { useAuthStore } from "@/stores/auth/store"
import { useToast } from "@/hooks/use-toast"
import { useAdminAccess } from "@/hooks/useAdminAccess"
import { ProfileDialog } from "@/components/profile/ProfileDialog"
import { UserMenuSheet } from "@/components/auth/UserMenuSheet"

export const UserMenu = () => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { hasAdminAccess } = useAdminAccess()
  const { toast } = useToast()

  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)

  // Show visual feedback on roles after login
  console.log("UserMenu - Current user:", user?.email)
  console.log("UserMenu - Current roles:", roles)
  console.log("UserMenu - Has admin access:", hasAdminAccess)

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <UserMenuSheet
        isOpen={isSheetOpen}
        onOpenChange={setSheetOpen}
        userEmail={user?.email}
        isLoadingLogout={isLoading}
        onShowProfile={() => {
          setSheetOpen(false)
          setProfileDialogOpen(true)
        }}
        onLogout={handleLogout}
        hasAdminAccess={hasAdminAccess}
        roles={roles} // Pass roles to sheet
      />

      <ProfileDialog
        open={isProfileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  )
}
