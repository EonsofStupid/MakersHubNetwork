
import { ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { UserRole } from "@/auth/types/auth.types"
import { useToast } from "@/hooks/use-toast"
import { useAuthState } from "@/auth/hooks/useAuthState"
import { useAdminAccess } from "@/hooks/useAdminAccess"
import { useLogger } from "@/hooks/use-logger"
import { LogCategory } from "@/logging"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  adminOnly?: boolean
}

export const AuthGuard = ({ children, requiredRoles, adminOnly }: AuthGuardProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const logger = useLogger("AuthGuard", LogCategory.AUTH)
  
  // Use centralized auth state - avoid initialization loops
  const { isLoading, status, roles, user } = useAuthState()
  const { hasAdminAccess } = useAdminAccess()

  const isAuthenticated = status === "authenticated" && !!user?.id

  // Check if user has required roles or admin access when needed
  const hasRequiredRole = requiredRoles 
    ? requiredRoles.some(r => roles.includes(r)) || hasAdminAccess
    : true

  // Special check for admin routes
  const hasAdminPermission = adminOnly ? hasAdminAccess : true

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.info("AuthGuard - Redirecting to login: Not authenticated")
      // Keep track of the current path to redirect back after login
      const currentPath = location.pathname
      navigate(`/login?from=${encodeURIComponent(currentPath)}`)
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
      navigate("/")
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
      navigate("/")
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
    location.pathname, 
    toast,
    logger
  ])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null
  if (requiredRoles && !hasRequiredRole) return null
  if (adminOnly && !hasAdminPermission) return null

  return <>{children}</>
}
