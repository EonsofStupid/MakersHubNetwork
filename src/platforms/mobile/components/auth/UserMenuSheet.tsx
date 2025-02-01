import React from "react"
import { Link } from "react-router-dom"
import { User, Settings, LayoutDashboard, LogOut } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
  isAdmin: boolean
  isLoadingLogout: boolean
  onShowProfile: () => void
  onLogout: () => void
}

export const UserMenuSheet: React.FC<UserMenuSheetProps> = ({
  isOpen,
  onOpenChange,
  userEmail,
  isAdmin,
  isLoadingLogout,
  onShowProfile,
  onLogout,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[80vw] pt-4">
        <div className="space-y-4">
          <div className="px-2">
            <h2 className="text-lg font-bold text-primary">
              {userEmail || "My Account"}
            </h2>
          </div>

          <nav className="space-y-1">
            <button
              onClick={onShowProfile}
              className="flex w-full items-center gap-3 px-2 py-3 text-base
                       transition-colors rounded-md hover:bg-primary/10"
            >
              <User className="h-5 w-5 text-primary" />
              Profile
            </button>

            <Link
              to="/settings"
              className="flex items-center gap-3 px-2 py-3 text-base
                       transition-colors rounded-md hover:bg-primary/10"
              onClick={() => onOpenChange(false)}
            >
              <Settings className="h-5 w-5 text-primary" />
              Settings
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-2 py-3 text-base
                         transition-colors rounded-md hover:bg-primary/10"
                onClick={() => onOpenChange(false)}
              >
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={onLogout}
              disabled={isLoadingLogout}
              className="flex w-full items-center gap-3 px-2 py-3 text-base
                       transition-colors rounded-md hover:bg-red-500/10 text-red-500"
            >
              <LogOut className="h-5 w-5" />
              {isLoadingLogout ? "Logging out..." : "Log out"}
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}