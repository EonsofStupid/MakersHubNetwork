import { useEffect } from "react"
import { supabase } from "@/app/integrations/supabase/client"
import { useAuthStore } from "@/app/stores/auth/store"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initial load of auth state (including user roles)
    initialize()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      initialize()
    })

    return () => subscription.unsubscribe()
  }, [initialize])

  return <>{children}</>
} 