
import React, { useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel } from '@/shared/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Label, Textarea } from '@/shared/ui';
import { logger } from '@/logging/logger.service';

interface ProfileEditorProps {
  onCancel?: () => void;
  onSave?: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ 
  onCancel, 
  onSave 
}) => {
  const { user, updateProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form state with user data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || ''
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Update user profile
      await updateProfile({
        name: formData.name,
        avatar_url: formData.avatar_url,
        bio: formData.bio
      });
      
      logger.log(LogLevel.INFO, LogCategory.UI, 'Profile updated', {
        userId: user.id
      });
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.UI, 'Profile update failed', {
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to edit your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              disabled
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input 
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileEditor;
