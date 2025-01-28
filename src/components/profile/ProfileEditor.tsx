import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth/store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const profile = user?.user_metadata;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    theme_preference: profile?.theme_preference || 'cyberpunk',
    motion_enabled: profile?.motion_enabled ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: formData
      });

      if (error) throw error;

      // Update the profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          theme_preference: formData.theme_preference,
          motion_enabled: formData.motion_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className={cn(
        "space-y-6 p-6",
        "bg-background/20 backdrop-blur-xl",
        "rounded-lg border border-primary/30",
        "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]"
      )}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="bg-background/50"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme_preference">Theme</Label>
          <Input
            id="theme_preference"
            value={formData.theme_preference}
            onChange={(e) => setFormData(prev => ({ ...prev, theme_preference: e.target.value }))}
            className="bg-background/50"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="motion_enabled">Enable Animations</Label>
          <Switch
            id="motion_enabled"
            checked={formData.motion_enabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, motion_enabled: checked }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            "hover:bg-primary/10",
            "transition-colors duration-200"
          )}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "bg-primary hover:bg-primary/90",
            "transition-colors duration-200"
          )}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </motion.form>
  );
};