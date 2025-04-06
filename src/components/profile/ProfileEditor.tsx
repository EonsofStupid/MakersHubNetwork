
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserProfile } from '@/types/auth.unified';

interface ProfileEditorProps {
  user: UserProfile;
  onSave: (user: UserProfile) => void;
  onCancel: () => void;
}

export function ProfileEditor({ user, onSave, onCancel }: ProfileEditorProps) {
  // Safely get values with fallbacks
  const initialDisplayName = user.user_metadata?.display_name || user.username || '';
  const initialBio = user.user_metadata?.bio || '';
  const initialTheme = user.user_metadata?.theme_preference || 'system';
  const initialMotion = user.user_metadata?.motion_enabled ?? true;
  
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [theme, setTheme] = useState(initialTheme);
  const [motionEnabled, setMotionEnabled] = useState(initialMotion);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create updated user object
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          display_name: displayName,
          bio,
          theme_preference: theme,
          motion_enabled: motionEnabled
        }
      };
      
      // In a real app, you would call an API to update the user profile
      // For now, just simulate a delay and call onSave
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 border rounded-md bg-background"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded-md bg-background h-24"
          placeholder="Tell others about yourself..."
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="theme" className="text-sm font-medium">
          Theme Preference
        </label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full p-2 border rounded-md bg-background"
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="cyberpunk">Cyberpunk</option>
        </select>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="motion"
          checked={motionEnabled}
          onChange={(e) => setMotionEnabled(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="motion" className="text-sm font-medium">
          Enable motion effects
        </label>
      </div>
      
      <div className="pt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border rounded-md bg-background hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
