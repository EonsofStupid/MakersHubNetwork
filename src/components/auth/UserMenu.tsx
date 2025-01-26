import { useState } from "react"
import { useAuthStore } from "@/stores/auth/store"
import { useToast } from "@/hooks/use-toast"
import { ProfileDialog } from "@/components/profile/ProfileDialog"
import { UserMenuSheet } from "./UserMenuSheet"

export const UserMenu = () => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)

  const isAdmin = roles.includes("admin") || roles.includes("super_admin")

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
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
        isAdmin={isAdmin}
        isLoadingLogout={isLoading}
        onShowProfile={() => {
          setSheetOpen(false)
          setProfileDialogOpen(true)
        }}
        onLogout={handleLogout}
      />

      <ProfileDialog
        open={isProfileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  )
}