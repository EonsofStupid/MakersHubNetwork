
import React, { useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
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
  const userMetadata = user?.user_metadata || {};
  const displayName = user?.name || userMetadata.full_name || '';
  const bio = userMetadata.bio || '';
  const avatarUrl = user?.avatar_url || userMetadata.avatar_url || '';
  const locationValue = userMetadata.location || '';
  const website = userMetadata.website || '';
  
  const [formData, setFormData] = useState({
    displayName,
    bio,
    avatarUrl,
    location: locationValue,
    website
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
      if (updateProfile) {
        await updateProfile({
          name: formData.displayName,
          user_metadata: {
            ...userMetadata,
            full_name: formData.displayName,
            bio: formData.bio || '',
            avatar_url: formData.avatarUrl || '',
            location: formData.location || '',
            website: formData.website || ''
          }
        });
      }
      
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
            <Label htmlFor="displayName">Name</Label>
            <Input 
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Your email"
              disabled
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
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
