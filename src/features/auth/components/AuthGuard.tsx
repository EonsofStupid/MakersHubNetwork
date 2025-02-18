import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/app/stores/auth/store"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function AuthGuard({ children, requiredRoles = [] }: AuthGuardProps) {
  const location = useLocation()
  const { user, isLoading, role } = useAuthStore()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (
    requiredRoles.length > 0 &&
    !requiredRoles.includes(role || '')
  ) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 