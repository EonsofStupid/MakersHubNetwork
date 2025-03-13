
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuthStore } from "@/stores/auth/store"
import { router } from "@/router"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize)
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const roles = useAuthStore((state) => state.roles)

  // Initialize auth state on mount
  useEffect(() => {
    initialize().catch(console.error)
  }, [initialize])

  // Update router context with auth state
  useEffect(() => {
    // Only update if router is ready
    if (router.state.status !== 'pending') {
      router.update({
        context: {
          auth: {
            user,
            status,
            roles,
          },
        },
      })
    }
  }, [user, status, roles])

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      initialize().catch(console.error)
    })

    return () => subscription.unsubscribe()
  }, [initialize])

  return <>{children}</>
}
