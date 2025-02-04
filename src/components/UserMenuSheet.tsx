import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, User, Settings, LayoutDashboard, LogOut } from "lucide-react"
import { useAdminAccess } from "@/hooks/useAdminAccess"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
  isLoadingLogout: boolean
  onShowProfile: () => void
  onLogout: () => void
}

export const UserMenuSheet: React.FC<UserMenuSheetProps> = ({
  isOpen,
  onOpenChange,
  userEmail,
  isLoadingLogout,
  onShowProfile,
  onLogout,
}) => {
  const { hasAdminAccess } = useAdminAccess();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
        <div className="transform skew-x-[10deg] origin-top-right space-y-4 pt-6">
          <div className="px-4">
            <h2 className="text-lg font-heading font-bold text-primary">
              {userEmail || "My Account"}
            </h2>
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
                to="/admin"
                className="group flex items-center gap-2 px-4 py-2 text-sm
                           transition-colors rounded-md hover:bg-primary/10"
                onClick={() => onOpenChange(false)}
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