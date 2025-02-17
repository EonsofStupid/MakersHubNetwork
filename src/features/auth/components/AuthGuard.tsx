import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/app/stores/auth/store"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function AuthGuard({ children, requiredRoles = [] }: AuthGuardProps) {
  const location = useLocation()
  const { status, user } = useAuthStore()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some((role) => user?.role?.includes(role))
  ) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 