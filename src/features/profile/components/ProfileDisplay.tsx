import { useAuthStore } from "@/app/stores/auth/store";
import { Button } from "@/site/components/ui/button";
import { Card } from "@/site/components/ui/card";
import { cn } from "@/app/utils/cn";
import { Edit2, User } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeDataStream } from "@/site/components/theme/ThemeDataStream";
import { ProfileDialog } from "./ProfileDialog";
import { useState } from "react";

export const ProfileDisplay = () => {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <>
      <Card
        className={cn(
          "w-full max-w-2xl mx-auto",
          "bg-background/20 backdrop-blur-xl",
          "border border-primary/30",
          "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
          "relative overflow-hidden"
        )}
      >
        <ThemeDataStream className="absolute inset-0 pointer-events-none opacity-20" />
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary animate-morph-header">
              Profile
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="mad-scientist-hover"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-primary/50 overflow-hidden">
              {user.user_metadata?.avatar_url ? (
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

            <div className="flex-1 space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold">
                  {user.user_metadata?.display_name || "Anonymous User"}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
              <p className="mt-1">
                {user.user_metadata?.bio || "No bio provided"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Theme Preference
              </h4>
              <p className="mt-1 capitalize">
                {user.user_metadata?.theme_preference || "Default"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Motion Settings
              </h4>
              <p className="mt-1">
                {user.user_metadata?.motion_enabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </motion.div>
        </div>
      </Card>

      <ProfileDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </>
  );
};