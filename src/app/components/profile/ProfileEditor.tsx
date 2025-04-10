
import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ThemeDataStream } from "@/app/components/theme/ThemeDataStream";
import { cn } from "@/lib/utils";
import { X, Save, Upload, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth/store";

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.user_metadata?.display_name || "",
    bio: user?.user_metadata?.bio || "",
    theme_preference: user?.user_metadata?.theme_preference || "cyberpunk",
    motion_enabled: user?.user_metadata?.motion_enabled ?? true,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
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
                  "hover:bg-primary/20 transition-colors"
                )}
              >
                <Upload className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-background/50 rounded-md border border-input p-3"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Theme Preference</label>
              <Input
                value={formData.theme_preference}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_preference: e.target.value }))}
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Motion</label>
              <input
                type="checkbox"
                checked={formData.motion_enabled}
                onChange={(e) => setFormData(prev => ({ ...prev, motion_enabled: e.target.checked }))}
                disabled={isLoading}
                className="toggle-checkbox"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
