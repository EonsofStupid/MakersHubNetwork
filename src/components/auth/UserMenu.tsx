import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, X, User, Settings, LogOut, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores/auth/store"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProfileEditor } from "@/components/profile/ProfileEditor"

/**
 * UserMenu
 *
 * A refactored user menu component that:
 * - Opens a side Sheet with user actions (Profile, Settings, Admin, Logout)
 * - Opens a Dialog for editing profile (ProfileEditor)
 * - Tracks loading state for logout
 * - Maintains a consistent "cutting-edge" UI with some motion and tailwind classes
 */
export const UserMenu = () => {
  const { toast } = useToast()

  // Menu (Sheet) open state
  const [isSheetOpen, setSheetOpen] = useState(false)
  // Dialog (Profile) open state
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false)
  // Logout loading state
  const [isLoading, setIsLoading] = useState(false)

  // Global store
  const user = useAuthStore((state) => state.user)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)

  // Helper to check admin/super_admin
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
      {/* Sheet (Side Menu) */}
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Menu className="h-4 w-4 text-primary" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[300px] backdrop-blur-xl bg-background/80
                     border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]
                     transform-gpu before:content-[''] before:absolute before:inset-0
                     before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5
                     before:pointer-events-none"
          style={{
            clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translateX(0) skew(-10deg)",
            transformOrigin: "100% 50%",
          }}
        >
          {/* We "unskew" the content inside */}
          <div className="transform skew-x-[10deg] origin-top-right space-y-4 pt-6">
            <div className="px-4">
              <h2 className="text-lg font-heading font-bold text-primary">
                {user?.email || "My Account"}
              </h2>
            </div>
            <nav className="space-y-2">
              {/* Profile Button -> Opens Dialog */}
              <button
                onClick={() => {
                  setProfileDialogOpen(true)
                  setSheetOpen(false)
                }}
                className="group flex w-full items-center gap-2 px-4 py-2 text-sm
                           transition-colors rounded-md hover:bg-primary/10"
              >
                <User className="h-4 w-4 text-primary group-hover:animate-pulse" />
                Profile
              </button>

              {/* Settings Link */}
              <Link
                to="/settings"
                className="group flex items-center gap-2 px-4 py-2 text-sm
                           transition-colors rounded-md hover:bg-primary/10"
                onClick={() => setSheetOpen(false)}
              >
                <Settings className="h-4 w-4 text-primary group-hover:animate-pulse" />
                Settings
              </Link>

              {/* Admin Dashboard Link (only if isAdmin) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="group flex items-center gap-2 px-4 py-2 text-sm
                             transition-colors rounded-md hover:bg-primary/10"
                  onClick={() => setSheetOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-primary group-hover:animate-pulse" />
                  Admin Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="group flex w-full items-center gap-2 px-4 py-2 text-sm
                           transition-colors rounded-md hover:bg-red-500/10 text-red-500"
              >
                <LogOut className="h-4 w-4 group-hover:animate-pulse" />
                {isLoading ? "Logging out..." : "Log out"}
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog (Profile Editor) */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent
          className="sm:max-w-[425px] backdrop-blur-xl bg-background/80
                     border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]
                     p-6 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {/* Close Profile Editor */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setProfileDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-primary">
                Edit Profile
              </h2>
              {/* The ProfileEditor is presumably your own custom profile editing form */}
              <ProfileEditor onClose={() => setProfileDialogOpen(false)} />
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
