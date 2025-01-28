import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useThemeStore } from "@/stores/theme/store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileEditor } from "./ProfileEditor";
import { ThemeDataStream } from "@/components/theme/ThemeDataStream";
import { User, Edit2, Github, Twitter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProfileDisplay = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [themeData, setThemeData] = useState<any>(null);
  const user = useAuthStore((state) => state.user);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.id) return;
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.theme_preference) {
          const { data: theme, error: themeError } = await supabase
            .from('themes')
            .select('*')
            .eq('name', profile.theme_preference)
            .single();

          if (themeError && themeError.code !== 'PGRST116') {
            throw themeError;
          }

          setThemeData(theme);
        }

        setProfileData(profile);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id, toast]);

  const handleSocialConnect = async (platform: string) => {
    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon!`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing) {
    return <ProfileEditor 
      initialData={profileData} 
      onClose={() => setIsEditing(false)} 
      onSuccess={(updatedData) => {
        setProfileData(updatedData);
        setIsEditing(false);
      }}
    />;
  }

  return (
    <div className="relative min-h-[600px] w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "w-[672px] max-w-[95vw]",
          "rounded-lg overflow-hidden",
          "bg-background/20 backdrop-blur-xl",
          "border border-primary/30",
          "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
          "before:pointer-events-none",
          "relative z-50",
          "transform-gpu"
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
                <div className={cn(
                  "w-20 h-20 rounded-full",
                  "border-2 border-primary/50",
                  "overflow-hidden bg-primary/20",
                  "transition-all duration-300",
                  "group-hover:border-primary/80",
                  "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                )}>
                  {profileData?.avatar_url ? (
                    <img
                      src={profileData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-primary animate-morph-header">
                  {profileData?.display_name || user?.email?.split('@')[0] || "Anonymous Maker"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profileData?.bio || "No bio yet"}
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
                  "before:transition-transform before:duration-300"
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
              <p className="text-sm">{profileData?.theme_preference || "Default"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Layout</h4>
              <p className="text-sm">{profileData?.layout_preference?.contentWidth || "Default"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Motion</h4>
              <p className="text-sm">{profileData?.motion_enabled ? "Enabled" : "Disabled"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Sidebar</h4>
              <p className="text-sm">{profileData?.layout_preference?.sidebarPosition || "Left"}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 flex-wrap"
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
    </div>
  );
};