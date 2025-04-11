
import React, { useState } from 'react';
import { User } from "@/shared/types/auth.types";
import { Button } from "@/shared/ui/core/button";
import { Input } from "@/shared/ui/core/input";
import { Label } from "@/shared/ui/core/label";
import { Textarea } from "@/shared/ui/core/textarea";
import { useToast } from "@/shared/hooks/use-toast";

interface ProfileEditorProps {
  onClose?: () => void;
  user?: User;
}

export function ProfileEditor({ onClose, user }: ProfileEditorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || ''
  );
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [website, setWebsite] = useState(user?.profile?.website || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update profile logic would go here
      await new Promise(r => setTimeout(r, 500)); // Simulate API call

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input 
          id="display-name" 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short bio about yourself"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input 
          id="website" 
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://your-website.com"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
