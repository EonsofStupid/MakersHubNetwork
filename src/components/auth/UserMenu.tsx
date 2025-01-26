import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth/store";
import { User, Settings, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export const UserMenu = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Menu className="h-4 w-4 text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[300px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none"
          style={{
            clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translateX(0) skew(-10deg)",
            transformOrigin: "100% 50%",
          }}
        >
          <div className="transform skew-x-[10deg] origin-top-right">
            <div className="space-y-4 pt-6">
              <div className="px-4">
                <h2 className="text-lg font-heading font-bold text-primary">
                  {user?.email || "My Account"}
                </h2>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                >
                  <User className="h-4 w-4 text-primary group-hover:animate-pulse" />
                  Profile
                </button>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 text-primary group-hover:animate-pulse" />
                  Settings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary group-hover:animate-pulse" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 transition-colors rounded-md group"
                >
                  <LogOut className="h-4 w-4 group-hover:animate-pulse" />
                  {isLoading ? "Logging out..." : "Log out"}
                </button>
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
            style={{
              clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={() => setShowProfile(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-gradient" />
                <div className="relative flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/50 overflow-hidden mad-scientist-hover">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-heading font-bold text-primary">
                      {user?.user_metadata?.full_name || user?.email}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="text-sm font-medium mb-2">Roles</h3>
                  <div className="flex gap-2 flex-wrap">
                    {roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};