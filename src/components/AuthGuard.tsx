
import { ReactNode, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { UserRole } from "@/auth/types/auth.types"
import { useToast } from "@/hooks/use-toast"
import { useAuthState } from "@/auth/hooks/useAuthState"
import { useAdminAccess } from "@/admin/hooks/useAdminAccess"
import { useLogger } from "@/hooks/use-logger"
import { LogCategory } from "@/logging"
import { router } from "@/router"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  adminOnly?: boolean
  fallback?: ReactNode
}

export const AuthGuard = ({ 
  children, 
  requiredRoles, 
  adminOnly,
  fallback = <div>Loading authentication...</div> 
}: AuthGuardProps) => {
  const navigate = useNavigate()
  const { pathname } = router.state.location
  const { toast } = useToast()
  const logger = useLogger("AuthGuard", LogCategory.AUTH)
  
  // Use centralized auth state - avoid initialization loops
  const { isLoading, status, roles, user, initialized } = useAuthState()
  const { hasAdminAccess } = useAdminAccess()

  const isAuthenticated = status === "authenticated" && !!user?.id

  // Check if user has required roles or admin access when needed
  const hasRequiredRole = requiredRoles 
    ? requiredRoles.some(r => roles.includes(r)) || hasAdminAccess
    : true

  // Special check for admin routes
  const hasAdminPermission = adminOnly ? hasAdminAccess : true

  useEffect(() => {
    // Only perform checks after auth is initialized
    if (!initialized) return;
    
    if (!isLoading && !isAuthenticated) {
      logger.info("AuthGuard - Redirecting to login: Not authenticated")
      // Keep track of the current path to redirect back after login
      const currentPath = pathname
      navigate({ to: "/login", search: { from: encodeURIComponent(currentPath) }})
      return
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRequiredRole) {
      logger.info("AuthGuard - Redirecting to unauthorized: Missing required roles", {
        details: { requiredRoles, userRoles: roles }
      })
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page"
      })
      navigate({ to: "/" })
    }

    if (!isLoading && isAuthenticated && adminOnly && !hasAdminPermission) {
      logger.info("AuthGuard - Redirecting: Not an admin", {
        details: { userRoles: roles }
      })
      toast({
        variant: "destructive",
        title: "Admin Access Required",
        description: "You need admin privileges to access this section"
      })
      navigate({ to: "/" })
    }
  }, [
    isLoading, 
    isAuthenticated, 
    roles, 
    requiredRoles, 
    adminOnly, 
    hasRequiredRole, 
    hasAdminPermission, 
    navigate, 
    pathname, 
    toast,
    logger,
    initialized
  ])

  // Show a fallback while loading
  if (isLoading) return <>{fallback}</>
  
  // Early return for authenticated-only content
  if (initialized && !isAuthenticated) return null
  
  // Check role requirements
  if (initialized && requiredRoles && !hasRequiredRole) return null
  
  // Check admin requirements
  if (initialized && adminOnly && !hasAdminPermission) return null

  // If we're still initializing auth, render children to avoid flash
  return <>{children}</>
}
