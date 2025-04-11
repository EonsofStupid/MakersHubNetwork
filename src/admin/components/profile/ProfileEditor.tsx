
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/types/user';

export interface ProfileEditorProps {
  profile?: UserProfile;
  onSave?: (profile: Partial<UserProfile>) => void;
  onCancel?: () => void;
}

/**
 * Profile editor component for admin users
 */
export function ProfileEditor({ profile, onSave, onCancel }: ProfileEditorProps) {
  const [formState, setFormState] = React.useState({
    display_name: profile?.display_name || '',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formState);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input 
                id="display_name"
                name="display_name"
                value={formState.display_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input 
                id="avatar_url"
                name="avatar_url"
                value={formState.avatar_url}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio"
                name="bio"
                value={formState.bio}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button variant="outline" type="button" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                Save Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default ProfileEditor;
