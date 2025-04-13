
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { User, Edit2, Github, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileEditor } from "./ProfileEditor";

export const ProfileDisplay = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  // Extract user information safely
  const userMetadata = user?.user_metadata || {};
  const displayName = profile?.name || userMetadata.full_name || "Anonymous Maker";
  const bio = profile?.bio || userMetadata.bio || "No bio yet";
  const theme = userMetadata.theme_preference || "Cyberpunk";
  const motionEnabled = userMetadata.motion_enabled === true;

  const handleSocialConnect = (platform: string) => {
    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon!`,
      variant: "default",
    });
  };

  if (isEditing) {
    return <ProfileEditor onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div
        className={cn(
          "w-[672px] max-w-[95vw]", // Increased by 12% from 600px
          "rounded-lg overflow-hidden",
          "bg-background/20 backdrop-blur-xl",
          "border border-primary/30",
          "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
          "before:pointer-events-none",
          "relative z-50",
          "transform-gpu scale-[1.12]" // 12% scale increase
        )}
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 240, 255, 0.3) transparent"
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {/* This would normally be the ThemeDataStream component */}
        </div>
        
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full border-2 border-primary/50 overflow-hidden bg-primary/20">
                  {userMetadata.avatar_url ? (
                    <img
                      src={userMetadata.avatar_url as string}
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
                  {displayName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {bio}
                </p>
              </div>
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Theme</h4>
              <p className="text-sm">{theme}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Motion</h4>
              <p className="text-sm">{motionEnabled ? "Enabled" : "Disabled"}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
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
          </div>
        </div>
      </div>
    </div>
  );
}
