import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth/store"
import { UserRole } from "@/stores/auth/types/auth.types"

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

  const isAuthenticated = status === "authenticated" && userId

  // Debug logs to help us understand what's happening
  console.log("AuthGuard - Current roles:", roles)
  console.log("AuthGuard - Required roles:", requiredRoles)
  console.log("AuthGuard - Is authenticated:", isAuthenticated)
  console.log("AuthGuard - User ID:", userId)

  const hasRequiredRole = requiredRoles 
    ? requiredRoles.some(r => roles.includes(r) || roles.includes('super_admin'))
    : true

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("AuthGuard - Redirecting to login: Not authenticated")
      navigate("/login")
      return
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRequiredRole) {
      console.log("AuthGuard - Redirecting to unauthorized: Missing required roles")
      navigate("/unauthorized")
    }
  }, [isLoading, isAuthenticated, roles, requiredRoles, navigate, hasRequiredRole])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null
  if (requiredRoles && !hasRequiredRole) return null

  return <>{children}</>
}