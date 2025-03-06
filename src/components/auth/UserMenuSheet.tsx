
import { useMemo } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Settings,
  LogOut,
  Shield,
  Heart,
  MessageSquare,
  Bookmark,
  HelpCircle,
  AlertCircle,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAdminPreferences } from "@/admin/store/adminPreferences.store"

interface UserMenuSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail?: string
  isLoadingLogout: boolean
  onShowProfile: () => void
  onLogout: () => void
  hasAdminAccess: boolean
  roles: string[]
}

export function UserMenuSheet({
  isOpen,
  onOpenChange,
  userEmail,
  isLoadingLogout,
  onShowProfile,
  onLogout,
  hasAdminAccess,
  roles,
}: UserMenuSheetProps) {
  const location = useLocation()
  const { routerPreference } = useAdminPreferences()
  
  // Determine the admin URL based on the router preference
  const adminUrl = useMemo(() => {
    // If we're already on an admin page and using TanStack router
    if (routerPreference === 'tanstack' && location.pathname.startsWith('/admin/')) {
      return '/admin/overview'
    }
    
    // If we're using TanStack explicitly
    if (routerPreference === 'tanstack') {
      return '/admin/overview'
    }
    
    // Default to legacy route
    return '/admin?tab=overview'
  }, [routerPreference, location.pathname])

  const menuItems = [
    {
      title: "My Profile",
      icon: <User className="w-4 h-4 mr-2" />,
      onClick: onShowProfile,
      showSeparator: true,
    },
    hasAdminAccess && {
      title: "Admin Panel",
      icon: <Shield className="w-4 h-4 mr-2" />,
      to: adminUrl,
      showSeparator: true,
    },
    {
      title: "Favorites",
      icon: <Heart className="w-4 h-4 mr-2" />,
      to: "/favorites",
    },
    {
      title: "Messages",
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
      to: "/messages",
    },
    {
      title: "Saved Items",
      icon: <Bookmark className="w-4 h-4 mr-2" />,
      to: "/saved",
      showSeparator: true,
    },
    {
      title: "Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      to: "/settings",
    },
    {
      title: "Help & Support",
      icon: <HelpCircle className="w-4 h-4 mr-2" />,
      to: "/help",
    },
    {
      title: "About",
      icon: <AlertCircle className="w-4 h-4 mr-2" />,
      to: "/about",
    },
  ].filter(Boolean) as {
    title: string
    icon: React.ReactNode
    to?: string
    onClick?: () => void
    showSeparator?: boolean
  }[]

  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle>Account Menu</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {userEmail || "User"}
            {roles && roles.length > 0 && (
              <span className="text-xs text-primary ml-2">
                ({roles.join(", ")})
              </span>
            )}
          </p>
        </SheetHeader>

        <motion.div
          className="flex-1 overflow-auto"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <div key={item.title}>
                <motion.div variants={itemVariants}>
                  {item.to ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base font-normal py-5"
                      asChild
                    >
                      <Link to={item.to}>
                        {item.icon}
                        {item.title}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base font-normal py-5"
                      onClick={item.onClick}
                    >
                      {item.icon}
                      {item.title}
                    </Button>
                  )}
                </motion.div>
                {item.showSeparator && <Separator className="my-2" />}
              </div>
            ))}
          </nav>
        </motion.div>

        <SheetFooter className="mt-auto">
          <Button
            variant="destructive"
            className="w-full mt-4"
            onClick={onLogout}
            disabled={isLoadingLogout}
          >
            {isLoadingLogout ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging out...
              </span>
            ) : (
              <span className="flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </span>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
