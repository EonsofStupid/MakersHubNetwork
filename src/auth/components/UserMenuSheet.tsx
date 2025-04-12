
import React from "react"
import { LogOut, Settings, User, Shield } from "lucide-react"
import { Sheet, SheetContent, SheetHeader } from "@/shared/ui/sheet"
import { Button } from "@/shared/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Separator } from "@/shared/ui/separator"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/utils/cn"
import { UserRole } from "@/shared/types/shared.types"
import { authBridge } from "@/auth/bridge"
import { useAdminNavigation } from "@/admin/hooks/useAdminNavigation"

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
  const { navigateToAdmin, hasAdminAccess } = useAdminNavigation();

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

  const handleAdminClick = () => {
    navigateToAdmin();
    onOpenChange(false); // Close the sheet
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="text-left">
          <div className="flex items-center gap-3 pb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userAvatar || undefined} alt={userDisplayName || "User"} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{userDisplayName || "User"}</span>
              {userEmail && (
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              )}
            </div>
          </div>
        </SheetHeader>

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

        {hasAdminAccess() && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 py-4">
              <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                Administration
              </h4>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start gap-2",
                  "bg-primary/5 hover:bg-primary/10"
                )}
                onClick={handleAdminClick}
              >
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-primary">Admin Dashboard</span>
              </Button>

              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => {
                  onOpenChange(false);
                  navigateToAdmin();
                }}
              >
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
