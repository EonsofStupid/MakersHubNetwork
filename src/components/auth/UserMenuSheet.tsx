
import React from "react"
import { Link } from "react-router-dom"
import { Menu, User, Settings, LayoutDashboard, LogOut, Shield, Crown } from "lucide-react"
import { UserRole } from "@/types/auth.types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useLocation } from "react-router-dom"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
  isLoadingLogout: boolean
  onShowProfile: () => void
  onLogout: () => void
  hasAdminAccess: boolean
  roles: UserRole[]
}

export const UserMenuSheet: React.FC<UserMenuSheetProps> = ({
  isOpen,
  onOpenChange,
  userEmail,
  isLoadingLogout,
  onShowProfile,
  onLogout,
  hasAdminAccess,
  roles,
}) => {
  const location = useLocation();
  
  // Helper to get role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return <Crown className="h-3 w-3" />
      case "admin":
        return <Shield className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
        >
          <Menu className="h-4 w-4 text-primary" />
          {hasAdminAccess && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
          )}
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
        <div className="transform skew-x-[10deg] origin-top-right space-y-4 pt-6">
          <div className="px-4 space-y-2">
            <h2 className="text-lg font-heading font-bold text-primary">
              {userEmail || "My Account"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge
                  key={role}
                  variant={role.includes("admin") ? "default" : "secondary"}
                  className="flex items-center gap-1 animate-in fade-in-50 duration-300"
                >
                  {getRoleIcon(role)}
                  {role.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={onShowProfile}
              className="group flex w-full items-center gap-2 px-4 py-2 text-sm
                         transition-colors rounded-md hover:bg-primary/10"
            >
              <User className="h-4 w-4 text-primary group-hover:animate-pulse" />
              Profile
            </button>

            <Link
              to="/settings"
              className="group flex items-center gap-2 px-4 py-2 text-sm
                         transition-colors rounded-md hover:bg-primary/10"
              onClick={() => onOpenChange(false)}
            >
              <Settings className="h-4 w-4 text-primary group-hover:animate-pulse" />
              Settings
            </Link>

            {hasAdminAccess && (
              <Link
                to="/admin/overview"
                className="group flex items-center gap-2 px-4 py-2 text-sm
                           transition-colors rounded-md hover:bg-primary/10"
                onClick={() => {
                  console.log("Admin Dashboard link clicked");
                  onOpenChange(false);
                }}
              >
                <LayoutDashboard className="h-4 w-4 text-primary group-hover:animate-pulse" />
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={onLogout}
              disabled={isLoadingLogout}
              className="group flex w-full items-center gap-2 px-4 py-2 text-sm
                         transition-colors rounded-md hover:bg-red-500/10 text-red-500"
            >
              <LogOut className="h-4 w-4 group-hover:animate-pulse" />
              {isLoadingLogout ? "Logging out..." : "Log out"}
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
