
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuthStore } from "@/stores/auth/store"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)
  const status = useAuthStore((state) => state.status)

  useEffect(() => {
    // Initial load of auth state (including user roles)
    if (!initialized) {
      initialize()
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      initialize()
    })

    return () => subscription.unsubscribe()
  }, [initialize, initialized])

  return <>{children}</>
}
