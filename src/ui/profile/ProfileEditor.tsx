
import { User } from "@/types";
import { Button } from "@/ui/core/button";
import { Input } from "@/ui/core/input";
import { Label } from "@/ui/core/label";
import { Textarea } from "@/ui/core/textarea";
import { useState } from "react";
import { useAuth } from "@/auth/hooks/useAuth";

interface ProfileEditorProps {
  user: User;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditor({ user, onSave, onCancel }: ProfileEditorProps) {
  const { updateProfile } = useAuth();
  const [formState, setFormState] = useState({
    displayName: user.displayName || '',
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProfile) {
      await updateProfile(formState);
    }
    onSave();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input 
          id="displayName"
          name="displayName"
          value={formState.displayName}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input 
          id="avatarUrl"
          name="avatarUrl"
          value={formState.avatarUrl}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio"
          name="bio"
          value={formState.bio}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
