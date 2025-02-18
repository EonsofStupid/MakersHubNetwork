import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/app/stores/auth/store"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function AuthGuard({ children, requiredRoles = [] }: AuthGuardProps) {
  const location = useLocation()
  const { user, isLoading, isAdmin, isSuperAdmin, role } = useAuthStore()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required role
  const hasRequiredRole = requiredRoles.length === 0 || 
    (isAdmin && requiredRoles.includes('admin')) || 
    (isSuperAdmin && requiredRoles.includes('super_admin')) ||
    (role && requiredRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 