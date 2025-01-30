import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth/store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ProfileEditorProps {
  initialData: any;
  onClose: () => void;
  onSuccess: (updatedData: any) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ 
  initialData, 
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || '',
    bio: initialData?.bio || '',
    theme_preference: initialData?.theme_preference || 'default',
    motion_enabled: initialData?.motion_enabled ?? true,
    layout_preference: initialData?.layout_preference || {
      contentWidth: 'full',
      sidebarPosition: 'left'
    },
    social_links: initialData?.social_links || {},
    custom_styles: initialData?.custom_styles || {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          theme_preference: formData.theme_preference,
          motion_enabled: formData.motion_enabled,
          layout_preference: formData.layout_preference,
          social_links: formData.social_links,
          custom_styles: formData.custom_styles,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;

      onSuccess(data);
    } catch (error: any) {
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
          <Select
            value={formData.theme_preference}
            onValueChange={(value) => setFormData(prev => ({ ...prev, theme_preference: value }))}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="neon">Neon</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub Profile</Label>
          <Input
            id="github"
            value={formData.social_links.github || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              social_links: { ...prev.social_links, github: e.target.value }
            }))}
            className="bg-background/50"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter Profile</Label>
          <Input
            id="twitter"
            value={formData.social_links.twitter || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              social_links: { ...prev.social_links, twitter: e.target.value }
            }))}
            className="bg-background/50"
            placeholder="https://twitter.com/yourusername"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content_width">Content Width</Label>
          <Select
            value={formData.layout_preference.contentWidth}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              layout_preference: {
                ...prev.layout_preference,
                contentWidth: value
              }
            }))}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="wide">Wide</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sidebar_position">Sidebar Position</Label>
          <Select
            value={formData.layout_preference.sidebarPosition}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              layout_preference: {
                ...prev.layout_preference,
                sidebarPosition: value
              }
            }))}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
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
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </motion.form>
  );
};