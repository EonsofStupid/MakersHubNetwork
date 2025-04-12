
import React, { useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';

interface ProfileEditorProps {
  onClose?: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, updateUserProfile } = useAuthStore();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(user?.profile?.display_name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      await updateUserProfile({
        display_name: displayName,
        bio,
        avatar_url: avatarUrl
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.'
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="displayName" className="text-xs font-medium">
          Display Name
        </label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full"
          placeholder="Enter your display name"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="bio" className="text-xs font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full min-h-[80px]"
          placeholder="Tell us about yourself"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="avatarUrl" className="text-xs font-medium">
          Avatar URL
        </label>
        <Input
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
