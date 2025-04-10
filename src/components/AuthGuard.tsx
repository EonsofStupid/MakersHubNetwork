
import { ReactNode } from "react"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: any[]
  adminOnly?: boolean
}

// AuthGuard that doesn't actually guard anything - just renders children
export const AuthGuard = ({ children }: AuthGuardProps) => {
  // Always render the children, no authentication checks
  return <>{children}</>
}
