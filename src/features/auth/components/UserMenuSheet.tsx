import { Button } from "@/site/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/site/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/site/components/ui/avatar"
import { Separator } from "@/site/components/ui/separator"
import { Link } from "react-router-dom"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
  isLoadingLogout: boolean
  onShowProfile: () => void
  onLogout: () => void
  roles: string[]
}

export function UserMenuSheet({
  isOpen,
  onOpenChange,
  userEmail,
  isLoadingLogout,
  onShowProfile,
  onLogout,
  roles,
}: UserMenuSheetProps) {
  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split(".")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  const isAdmin = roles.includes("admin") || roles.includes("super_admin")

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          onClick={() => onOpenChange(true)}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userEmail}</span>
              <span className="text-xs text-muted-foreground">
                {roles.join(", ")}
              </span>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Button variant="ghost" onClick={onShowProfile}>
              Profile
            </Button>
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin Dashboard</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onLogout}
              disabled={isLoadingLogout}
            >
              {isLoadingLogout ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 