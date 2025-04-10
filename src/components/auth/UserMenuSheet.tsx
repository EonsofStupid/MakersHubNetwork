
import React from "react"
import { Link } from "react-router-dom"
import { Menu, User, Settings, LayoutDashboard, LogOut, Shield, Crown, Link as LinkIcon } from "lucide-react"
import { UserRole } from "@/auth/types/auth.types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { FcGoogle } from "react-icons/fc"
import { AuthBridge } from "@/auth/bridge"
import { useToast } from "@/hooks/use-toast"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
  userDisplayName?: string
  userAvatar?: string | null
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
  userDisplayName,
  userAvatar,
  isLoadingLogout,
  onShowProfile,
  onLogout,
  hasAdminAccess,
  roles,
}) => {
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

  const { toast } = useToast();
  const [linking, setLinking] = React.useState(false);

  // Function to handle linking Google account
  const handleLinkGoogle = async () => {
    try {
      setLinking(true);
      await AuthBridge.linkSocialAccount('google');
      toast({
        title: "Account linked",
        description: "Your Google account has been linked successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error linking account:", error);
      toast({
        title: "Error linking account",
        description: error instanceof Error ? error.message : "Failed to link Google account",
        variant: "destructive"
      });
    } finally {
      setLinking(false);
    }
  };

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
            {userAvatar && (
              <div className="h-12 w-12 rounded-full bg-primary/10 border 
                             border-primary/30 flex items-center justify-center 
                             overflow-hidden mb-3">
                <img 
                  src={userAvatar} 
                  alt={userDisplayName || "User"} 
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <h2 className="text-lg font-heading font-bold text-primary">
              {userDisplayName || userEmail || "My Account"}
            </h2>
            {userEmail && userDisplayName && (
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            )}
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

            {/* Link Google Account button for users with password auth */}
            <button
              onClick={handleLinkGoogle}
              disabled={linking}
              className="group flex w-full items-center gap-2 px-4 py-2 text-sm
                       transition-colors rounded-md hover:bg-primary/10"
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary group-hover:animate-pulse" />
                <FcGoogle className="h-4 w-4" />
              </div>
              {linking ? "Linking Account..." : "Link Google Account"}
            </button>

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
