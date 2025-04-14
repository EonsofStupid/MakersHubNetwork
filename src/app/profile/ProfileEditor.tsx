
import React, { useState } from 'react';
import { UserProfile } from '@/shared/types/shared.types';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Switch } from '@/shared/ui/switch';
import { toast } from '@/shared/ui/use-toast';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => Promise<void>;
  onCancel: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(profile.name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicProfile, setPublicProfile] = useState(
    profile.user_metadata?.public_profile === true
  );

  // Extract the first letter of the name or email for the avatar fallback
  const getInitials = () => {
    if (name) return name.charAt(0).toUpperCase();
    return profile.email.charAt(0).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare updated profile data
      const updatedProfile: Partial<UserProfile> = {
        name,
        avatar_url: avatarUrl,
        bio,
        user_metadata: {
          ...profile.user_metadata,
          public_profile: publicProfile
        }
      };
      
      await onSave(updatedProfile);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-sm text-muted-foreground">
                Enter a URL for your profile picture
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="public-profile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
              <Label htmlFor="public-profile">Make my profile public</Label>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileEditor;
