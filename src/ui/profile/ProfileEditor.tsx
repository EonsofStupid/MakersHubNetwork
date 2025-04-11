
import React, { useState } from 'react';
import { Button } from "@/ui/core/button";
import { Input } from "@/ui/core/input";
import { Label } from "@/ui/core/label";
import { Textarea } from "@/ui/core/textarea";
import { useToast } from '@/ui/hooks/use-toast';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { User, UserProfile } from '@/types';

interface ProfileEditorProps {
  onClose: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { toast } = useToast();
  const { user, profile } = useAuthState();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with existing data
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || user?.displayName || '',
    bio: profile?.bio || '',
    avatarUrl: profile?.avatar_url || user?.avatarUrl || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock update for now - in a real app this would call the updateProfile function
      // from AuthState which should be implemented in the auth module
      console.log('Profile update requested:', formData);
      
      // Show success message
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />
        {formData.avatarUrl && (
          <div className="mt-2">
            <img
              src={formData.avatarUrl}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
