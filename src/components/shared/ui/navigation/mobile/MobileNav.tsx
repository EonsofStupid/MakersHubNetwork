import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store/auth-store";
import { Menu, LogOut, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MobileNavContent } from "./MobileNavContent";
import { supabase } from "@/integrations/supabase/client";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, user, signOut } = useAuthStore();

  useEffect(() => {
    console.log('MobileNav: Auth state changed', { 
      hasSession: !!session,
      userId: session?.user?.id,
      userRole: user?.role 
    });

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, session, user]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      setIsAuthenticating(true);
      await signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignIn = () => {
    setIsOpen(false);
    navigate("/login");
  };

  if (isAuthenticating) {
    return (
      <div className="md:hidden flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { rotate: 180, scale: 1.1 },
            closed: { rotate: 0, scale: 1 }
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Menu className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-[#41f0db]" />
        </motion.div>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#41f0db]/10 to-[#8000ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10 rounded-full" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 bg-gradient-to-b from-[#151A24] to-[#1A1F2C] backdrop-blur-xl z-50 p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                {session ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <User className="h-8 w-8 text-[#41f0db]" />
                    <div>
                      <p className="text-sm font-medium text-white">{user?.email}</p>
                      <p className="text-xs text-[#41f0db]">{user?.role?.toUpperCase()}</p>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-[#41f0db] to-[#8000ff] hover:opacity-90 text-white"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                )}

                <MobileNavContent isOpen={isOpen} onClose={() => setIsOpen(false)} />

                {session && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={handleSignOut}
                      className="w-full mt-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                      variant="ghost"
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-2" />
                      )}
                      Sign Out
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};