
import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface ProfileEditorProps {
  onClose?: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const logger = useLogger('ProfileEditor', LogCategory.USER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    displayName: user?.user_metadata?.name || '',
    bio: user?.profile?.bio || '',
    website: user?.profile?.website || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        display_name: form.displayName,
        full_name: form.displayName,
        bio: form.bio,
        website: form.website,
        avatar_url: form.avatarUrl,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      logger.info('User profile updated');
      onClose?.();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 
          error instanceof Error 
            ? error.message 
            : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      
      logger.error('Failed to update user profile', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        You need to be signed in to edit your profile.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </label>
        <Input
          id="displayName"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder="Your display name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="avatarUrl" className="text-sm font-medium">
          Avatar URL
        </label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          value={form.avatarUrl}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />
        {form.avatarUrl && (
          <div className="mt-2">
            <img
              src={form.avatarUrl}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="website" className="text-sm font-medium">
          Website
        </label>
        <Input
          id="website"
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
