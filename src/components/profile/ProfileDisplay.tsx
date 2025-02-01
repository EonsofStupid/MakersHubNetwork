import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileEditor } from "./ProfileEditor";
import { ThemeDataStream } from "@/components/theme/ThemeDataStream";
import { User, Edit2, Github, Twitter, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const ProfileDisplay = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.id) return;
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        setProfileData(profile || {
          id: user.id,
          display_name: user.email?.split('@')[0],
          avatar_url: null,
          motion_enabled: true,
          layout_preference: {
            contentWidth: 'full',
            sidebarPosition: 'left'
          },
          social_links: {},
          bio: '',
          custom_styles: {}
        });

      } catch (error: any) {
        console.error('Error fetching data:', error);
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${crypto.randomUUID()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      setUploadProgress(100);

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
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
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
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
                <label className={cn(
                  "cursor-pointer",
                  "block relative",
                  "w-20 h-20 rounded-full",
                  "border-2 border-primary/50",
                  "overflow-hidden bg-primary/20",
                  "transition-all duration-300",
                  "group-hover:border-primary/80",
                  "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                )}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Avatar className="w-full h-full">
                    {profileData?.avatar_url ? (
                      <AvatarImage
                        src={profileData.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        {isUploading ? (
                          <Upload className="w-8 h-8 text-primary animate-pulse" />
                        ) : (
                          <User className="w-8 h-8 text-primary" />
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {uploadProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1">
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}
                </label>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-primary">
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
              <h4 className="text-sm font-medium text-muted-foreground">Layout</h4>
              <p className="text-sm capitalize">{profileData?.layout_preference?.contentWidth || "Default"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Motion</h4>
              <p className="text-sm">{profileData?.motion_enabled ? "Enabled" : "Disabled"}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Sidebar</h4>
              <p className="text-sm capitalize">{profileData?.layout_preference?.sidebarPosition || "Left"}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 flex-wrap"
          >
            {profileData?.social_links?.github && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(profileData.social_links.github, '_blank')}
                className={cn(
                  "group relative overflow-hidden",
                  "before:absolute before:inset-0",
                  "before:bg-primary/20 before:translate-y-full",
                  "hover:before:translate-y-0",
                  "before:transition-transform before:duration-300"
                )}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            )}
            {profileData?.social_links?.twitter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(profileData.social_links.twitter, '_blank')}
                className={cn(
                  "group relative overflow-hidden",
                  "before:absolute before:inset-0",
                  "before:bg-primary/20 before:translate-y-full",
                  "hover:before:translate-y-0",
                  "before:transition-transform before:duration-300"
                )}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};