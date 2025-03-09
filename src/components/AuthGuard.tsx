
import { ReactNode, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth/store"
import { UserRole } from "@/types/auth.types"
import { useAdminAccess } from "@/hooks/useAdminAccess"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  fallback?: ReactNode
}

export const AuthGuard = ({ children, requiredRoles, fallback }: AuthGuardProps) => {
  const navigate = useNavigate()
  const isLoading = useAuthStore((state) => state.isLoading)
  const status = useAuthStore((state) => state.status)
  const roles = useAuthStore((state) => state.roles)
  const userId = useAuthStore((state) => state.user?.id)
  const { hasAdminAccess } = useAdminAccess()

  const isAuthenticated = status === "authenticated" && userId

  // Debug logs to help us understand what's happening
  console.log("AuthGuard - Current roles:", roles)
  console.log("AuthGuard - Required roles:", requiredRoles)
  console.log("AuthGuard - Is authenticated:", isAuthenticated)
  console.log("AuthGuard - User ID:", userId)
  console.log("AuthGuard - Has admin access:", hasAdminAccess)

  const hasRequiredRole = requiredRoles 
    ? requiredRoles.some(r => roles.includes(r)) || hasAdminAccess
    : true

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("AuthGuard - Redirecting to login: Not authenticated")
      navigate({ 
        to: "/login",
        search: {
          redirect: window.location.pathname
        }
      })
      return
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRequiredRole) {
      console.log("AuthGuard - Redirecting to unauthorized: Missing required roles")
      navigate({ to: "/" })
    }
  }, [isLoading, isAuthenticated, roles, requiredRoles, navigate, hasRequiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="p-4 text-center">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) return fallback || null
  if (requiredRoles && !hasRequiredRole) return fallback || null

  return <>{children}</>
}
