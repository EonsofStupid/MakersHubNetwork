import { ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/auth/store"
import { UserRole } from "@/types/auth.types"
import { useAdminAccess } from "@/hooks/useAdminAccess"
import { useToast } from "@/hooks/use-toast"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  adminOnly?: boolean
}

export const AuthGuard = ({ children, requiredRoles, adminOnly }: AuthGuardProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isLoading = useAuthStore((state) => state.isLoading)
  const status = useAuthStore((state) => state.status)
  const roles = useAuthStore((state) => state.roles)
  const userId = useAuthStore((state) => state.user?.id)
  const { hasAdminAccess } = useAdminAccess()

  const isAuthenticated = status === "authenticated" && userId

  // Check if user has required roles or admin access when needed
  const hasRequiredRole = requiredRoles 
    ? requiredRoles.some(r => roles.includes(r)) || hasAdminAccess
    : true

  // Special check for admin routes
  const hasAdminPermission = adminOnly ? hasAdminAccess : true

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("AuthGuard - Redirecting to login: Not authenticated")
      // Keep track of the current path to redirect back after login
      const currentPath = location.pathname
      navigate(`/login?from=${encodeURIComponent(currentPath)}`)
      return
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRequiredRole) {
      console.log("AuthGuard - Redirecting to unauthorized: Missing required roles")
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page"
      })
      navigate("/")
    }

    if (!isLoading && isAuthenticated && adminOnly && !hasAdminPermission) {
      console.log("AuthGuard - Redirecting: Not an admin")
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
    toast
  ])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null
  if (requiredRoles && !hasRequiredRole) return null
  if (adminOnly && !hasAdminPermission) return null

  return <>{children}</>
}
