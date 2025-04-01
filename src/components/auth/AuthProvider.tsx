
import { useEffect } from "react"
import { AuthProvider as CoreAuthProvider } from "@/hooks/useAuth"

// This is just a wrapper around our new AuthProvider for backward compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <CoreAuthProvider>{children}</CoreAuthProvider>
}
