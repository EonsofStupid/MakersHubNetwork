
import { useState } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Upload, X, Save } from "lucide-react";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor = ({ onClose }: ProfileEditorProps) => {
  const { toast } = useToast();
  const logger = useLogger("ProfileEditor", LogCategory.USER);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || user?.user_metadata?.display_name || "",
    bio: profile?.bio || user?.user_metadata?.bio || "",
    theme_preference: profile?.theme_preference || user?.user_metadata?.theme_preference || "cyberpunk",
    motion_enabled: profile?.motion_enabled ?? user?.user_metadata?.motion_enabled ?? true,
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // This is a mock implementation since we don't have actual storage
      // In a real app, you would upload to storage and get a URL
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      logger.error("Error uploading avatar", { details: { error } });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMotion = () => {
    setFormData(prev => ({ 
      ...prev, 
      motion_enabled: !prev.motion_enabled 
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      await updateUserProfile(formData);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onClose();
    } catch (error) {
      logger.error("Error updating profile", { details: { error } });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "w-[600px] max-w-[90vw] rounded-lg overflow-hidden",
        "bg-background/20 backdrop-blur-xl",
        "border border-primary/30",
        "shadow-[0_0_32px_0_rgba(0,240,255,0.2)]",
        "relative z-50"
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* This would be the ThemeDataStream component */}
      </div>
      
      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary animate-morph-header">
            Edit Profile
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="mad-scientist-hover"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-2 border-primary/50 overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className={cn(
                  "absolute bottom-0 right-0 p-2",
                  "bg-background/80 backdrop-blur",
                  "border border-primary/30 rounded-full",
                  "cursor-pointer",
                  "hover:bg-primary/20 transition-colors",
                  "group-hover:scale-110 transition-transform"
                )}
              >
                <Upload className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="display_name" className="block text-sm font-medium">Display Name</label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full min-h-[100px] rounded-md border border-input bg-background/50 px-3 py-2"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="theme_preference" className="block text-sm font-medium">Theme Preference</label>
              <Input
                id="theme_preference"
                value={formData.theme_preference}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_preference: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="motion_enabled" className="text-sm font-medium">Enable Motion</label>
              <button 
                type="button"
                onClick={handleToggleMotion}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  formData.motion_enabled ? 'bg-primary' : 'bg-muted'
                } transition-colors focus:outline-none`}
                disabled={isLoading}
              >
                <span
                  className={`${
                    formData.motion_enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="mad-scientist-hover"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn(
                "relative overflow-hidden",
                "before:absolute before:inset-0",
                "before:bg-primary/20 before:translate-y-full",
                "hover:before:translate-y-0",
                "before:transition-transform before:duration-300",
                "mad-scientist-hover"
              )}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
