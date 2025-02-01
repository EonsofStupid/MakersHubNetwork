import { useState, useCallback } from "react"
import { useAuthStore } from "@/stores/auth/store"
import { useToast } from "@/hooks/use-toast"
import { ProfileDialog } from "@/components/profile"
import { UserMenuSheet } from "./UserMenuSheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

export const UserMenu = () => {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)

  const isAdmin = roles.includes("admin") || roles.includes("super_admin")
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  const handleLogout = useCallback(async () => {
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
      setSheetOpen(false)
    }
  }, [logout, toast])

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSheetOpen(true)
  }, [])

  return (
    <>
      <button
        onClick={handleButtonClick}
        className={cn(
          "relative group",
          "h-8 w-8 rounded-full overflow-hidden",
          "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
          "transition-all duration-300",
          "hover:ring-primary/50 hover:scale-110",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20",
          "before:opacity-0 before:transition-opacity before:duration-300",
          "group-hover:before:opacity-100"
        )}
      >
        <Avatar className="h-full w-full">
          <AvatarImage
            src={avatarUrl}
            alt={user?.email || "User avatar"}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/5">
            <User className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      </button>

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