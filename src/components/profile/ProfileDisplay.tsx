import { useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileEditor } from "./ProfileEditor";
import { ThemeDataStream } from "@/components/theme/ThemeDataStream";
import { User, Edit2, Link, Github, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProfileDisplay = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const profile = user?.user_metadata;

  const handleSocialConnect = (platform: string) => {
    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon!`,
      variant: "default",
    });
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "w-[600px] max-w-[90vw] rounded-lg overflow-hidden",
              "bg-background/20 backdrop-blur-xl",
              "border border-primary/30",
              "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
              "before:absolute before:inset-0",
              "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
              "before:pointer-events-none",
              "relative z-50"
            )}
          >
            <ThemeDataStream className="absolute inset-0 pointer-events-none opacity-20" />
            
            <div className="relative z-10 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/50 overflow-hidden bg-primary/20">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-primary animate-morph-header">
                      {profile?.display_name || "Anonymous Maker"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.bio || "No bio yet"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className={cn(
                      "relative overflow-hidden",
                      "before:absolute before:inset-0",
                      "before:bg-primary/20 before:translate-y-full",
                      "hover:before:translate-y-0",
                      "before:transition-transform before:duration-300",
                      "mad-scientist-hover"
                    )}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Theme</h4>
                  <p className="text-sm">{profile?.theme_preference || "Cyberpunk"}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Motion</h4>
                  <p className="text-sm">{profile?.motion_enabled ? "Enabled" : "Disabled"}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialConnect("GitHub")}
                  className={cn(
                    "group relative overflow-hidden",
                    "before:absolute before:inset-0",
                    "before:bg-primary/20 before:translate-y-full",
                    "hover:before:translate-y-0",
                    "before:transition-transform before:duration-300"
                  )}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Connect GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialConnect("Twitter")}
                  className={cn(
                    "group relative overflow-hidden",
                    "before:absolute before:inset-0",
                    "before:bg-primary/20 before:translate-y-full",
                    "hover:before:translate-y-0",
                    "before:transition-transform before:duration-300"
                  )}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Connect Twitter
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <ProfileEditor onClose={() => setIsEditing(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};