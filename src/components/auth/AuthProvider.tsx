
import { useEffect } from "react"
import { AuthProvider as CoreAuthProvider } from "@/hooks/useAuth"
import { notifyAuthReady, notifySignIn, notifySignOut, notifyUserUpdated, notifySessionUpdated, notifyAuthError } from "@/auth/bridge"
import { supabase } from "@/integrations/supabase/client"
import { useLogger } from "@/hooks/use-logger"
import { LogCategory } from "@/logging"

// This is just a wrapper around our new AuthProvider for backward compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const logger = useLogger("LegacyAuthProvider", LogCategory.AUTH)
  
  useEffect(() => {
    logger.info("Initializing legacy auth provider bridge")
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.debug(`Auth event received in legacy provider: ${event}`)
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            // Use setTimeout to avoid potential deadlocks
            setTimeout(async () => {
              try {
                const { data: rolesData, error: rolesError } = await supabase
                  .from("user_roles")
                  .select("role")
                  .eq("user_id", session.user.id)
                  
                if (rolesError) {
                  logger.error("Error fetching roles in legacy provider", { details: rolesError })
                }
                
                const roles = (rolesData?.map(r => r.role) || [])
                notifySignIn(session.user, session, roles)
              } catch (error) {
                logger.error("Error in legacy provider auth handling", { details: error })
              }
            }, 0)
          }
          break
          
        case 'SIGNED_OUT':
          notifySignOut()
          break
          
        case 'USER_UPDATED':
          if (session?.user) {
            notifyUserUpdated(session.user)
          }
          break
          
        case 'TOKEN_REFRESHED':
        case 'MFA_CHALLENGE_VERIFIED':
          if (session) {
            notifySessionUpdated(session)
          }
          break
      }
    })

    return () => {
      logger.info("Cleaning up legacy auth provider")
      subscription.unsubscribe()
    }
  }, [logger])

  return <CoreAuthProvider>{children}</CoreAuthProvider>
}
