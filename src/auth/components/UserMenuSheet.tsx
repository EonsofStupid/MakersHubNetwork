
import React from "react"
import { LogOut, Settings, User, Shield } from "lucide-react"
import { Sheet, SheetContent } from "@/shared/ui/sheet"
import { Button } from "@/shared/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Separator } from "@/shared/ui/separator"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/utils/cn"
import { UserRole } from "@/shared/types/SharedTypes"
import { useNavigate } from "react-router-dom"
import { RBACBridge } from "@/rbac/bridge"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string | null
  userDisplayName?: string | null
  userAvatar?: string | null
  isLoadingLogout?: boolean
  onShowProfile?: () => void
  onLogout?: () => void
  roles?: UserRole[]
}

export function UserMenuSheet({
  isOpen,
  onOpenChange,
  userEmail,
  userDisplayName,
  userAvatar,
  isLoadingLogout = false,
  onShowProfile,
  onLogout,
  roles = []
}: UserMenuSheetProps) {
  const navigate = useNavigate();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userDisplayName) return "U"
    return userDisplayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const hasAdminAccess = RBACBridge.hasAdminAccess();

  const handleAdminClick = () => {
    navigate('/admin');
    onOpenChange(false); // Close the sheet
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        className={cn(
          "trapezoid-sheet sm:max-w-sm backdrop-blur-xl bg-background/80 border-primary/20",
          "shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu"
        )}
      >
        <div className="transform">
          <div className="text-left">
            <div className="flex items-center gap-3 pb-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                <AvatarImage src={userAvatar || undefined} alt={userDisplayName || "User"} />
                <AvatarFallback className="bg-primary/10">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{userDisplayName || "User"}</span>
                {userEmail && (
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                )}
              </div>
            </div>
          </div>

          {/* User roles badges */}
          {roles && roles.length > 0 && (
            <div className="py-2">
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <Badge key={role} variant="outline" className="capitalize">
                    {role.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex flex-col gap-2 py-4">
            <Button
              variant="ghost"
              className="justify-start gap-2"
              onClick={onShowProfile}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-2"
              onClick={onLogout}
              disabled={isLoadingLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoadingLogout ? "Logging out..." : "Log out"}</span>
            </Button>
          </div>

          {hasAdminAccess && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2 py-4">
                <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                  Administration
                </h4>
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start gap-2 shimmer",
                    "bg-primary/5 hover:bg-primary/10 group relative overflow-hidden"
                  )}
                  onClick={handleAdminClick}
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-primary">Admin Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => {
                    navigate('/admin/settings');
                    onOpenChange(false);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span>System Settings</span>
                </Button>
              </div>
            </>
          )}
          
          {/* Cyber effect styling for the sheet */}
          <div className="sheet-accent"></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
