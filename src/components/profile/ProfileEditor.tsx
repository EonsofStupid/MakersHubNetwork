import { useState } from "react";
import { useAuthStore } from "@/app/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Upload, X, Save } from "lucide-react";
import { ThemeDataStream } from "@/components/theme/ThemeDataStream";

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor = ({ onClose }: ProfileEditorProps) => {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.user_metadata?.display_name || "",
    bio: user?.user_metadata?.bio || "",
    theme_preference: user?.user_metadata?.theme_preference || "cyberpunk",
    motion_enabled: user?.user_metadata?.motion_enabled ?? true,
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: formData
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
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
        "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
        "relative z-50"
      )}
    >
      <ThemeDataStream className="absolute inset-0 pointer-events-none opacity-20" />
      
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
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme_preference">Theme Preference</Label>
              <Input
                id="theme_preference"
                value={formData.theme_preference}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_preference: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="motion_enabled">Enable Motion</Label>
              <Switch
                id="motion_enabled"
                checked={formData.motion_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, motion_enabled: checked }))}
                disabled={isLoading}
              />
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
};