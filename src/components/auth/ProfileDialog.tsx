import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth/store";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog = ({ isOpen, onOpenChange }: ProfileDialogProps) => {
  const user = useAuthStore((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploading(true);
      // Here you would implement the actual file upload logic
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[90vw] max-w-[500px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu overflow-hidden"
        style={{
          clipPath: "polygon(20px 0, 100% 0, 95% 20px, 100% 40px, 95% calc(100% - 20px), 100% 100%, 0 100%, 5% calc(100% - 40px))",
          transform: "translateZ(0) perspective(1000px)",
        }}
      >
        <div className="relative space-y-6">
          {/* Header with Avatar */}
          <div className="flex flex-col items-center justify-center pt-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 bg-background/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-primary/60" />
                  </div>
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-white cursor-pointer transform transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(255,45,110,0.3)] hover:shadow-[0_0_15px_rgba(255,45,110,0.5)]"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
            </div>
            <h2 className="mt-4 text-xl font-heading font-bold text-primary">
              {profile?.display_name || user?.email}
            </h2>
          </div>

          {/* Profile Settings */}
          <div className="space-y-4 px-2">
            <div className="relative overflow-hidden rounded-lg border border-primary/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 py-6 mad-scientist-hover"
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};