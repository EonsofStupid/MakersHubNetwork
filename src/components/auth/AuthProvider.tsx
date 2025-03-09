
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuthStore } from "@/stores/auth/store"
import { router } from "@/router"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize)
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const roles = useAuthStore((state) => state.roles)

  // Update router context with auth state
  useEffect(() => {
    router.update({
      context: {
        auth: {
          user,
          status,
          roles,
        },
      },
    })
  }, [user, status, roles])

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
