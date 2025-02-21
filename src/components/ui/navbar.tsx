import * as React from "react"
import { cn } from "@/lib/utils"

interface AdminNavbarProps extends React.HTMLAttributes<HTMLElement> {}

export const AdminNavbar = React.forwardRef<HTMLElement, AdminNavbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "flex h-16 items-center border-b bg-background px-6",
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold">Admin Portal</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Add user profile, notifications, etc. here */}
        </div>
      </nav>
    )
  }
)
AdminNavbar.displayName = "AdminNavbar" 