
import { useState } from "react"
import { useAuthStore } from "@/stores/auth/store"
import { useToast } from "@/hooks/use-toast"
import { useAdminAccess } from "@/hooks/useAdminAccess"
import { ProfileDialog } from "@/components/profile/ProfileDialog"
import { UserMenuSheet } from "@/components/UserMenuSheet"

export const UserMenu = () => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isAdmin } = useAdminAccess()

  const { toast } = useToast()

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      window.location.reload() // Simple page reload after logout
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
        hasAdminAccess={isAdmin}
      />

      <ProfileDialog
        open={isProfileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  )
}
