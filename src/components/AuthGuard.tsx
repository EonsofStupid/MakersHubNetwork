import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/app/stores/auth/store"
import { UserRole } from "@/types/auth.types"
import { useAdminAccess } from "@/hooks/useAdminAccess"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
}

export const AuthGuard = ({ children, requiredRoles }: AuthGuardProps) => {
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
      navigate("/login")
      return
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRequiredRole) {
      console.log("AuthGuard - Redirecting to unauthorized: Missing required roles")
      navigate("/")
    }
  }, [isLoading, isAuthenticated, roles, requiredRoles, navigate, hasRequiredRole])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null
  if (requiredRoles && !hasRequiredRole) return null

  return <>{children}</>
}
