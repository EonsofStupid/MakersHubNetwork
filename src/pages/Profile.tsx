
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { useProfileStore } from '@/stores/profile/store';

export default function Profile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { profile, updateProfile, isLoading } = useProfileStore();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  
  const logger = useLogger('ProfilePage', { category: LogCategory.AUTH });
  
  useEffect(() => {
    if (user) {
      setDisplayName(profile?.display_name || '');
      setBio(profile?.bio || '');
    }
  }, [user, profile]);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      logger.info('Updating user profile', {
        details: { userId: user.id }
      });
      
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          bio: bio
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
      
      logger.info('Profile updated successfully');
    } catch (error) {
      logger.error('Error updating profile', {
        details: { error }
      });
      
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  // Extract user roles from profile or set empty array if undefined
  const userRoles = profile?.roles || [];
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Your Profile</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={displayName || user?.email || ''} />
                <AvatarFallback>{(displayName || user?.email || '').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{displayName || user.email}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input 
                    id="display-name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Your bio"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleUpdateProfile} disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Account ID</Label>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Last Sign In</Label>
                  <p className="text-sm">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleString() 
                      : 'Never'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Created At</Label>
                  <p className="text-sm">
                    {user.created_at 
                      ? new Date(user.created_at).toLocaleString() 
                      : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Roles</Label>
                  <p className="text-sm">
                    {userRoles.length > 0 
                      ? userRoles.join(', ') 
                      : 'No roles assigned'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
