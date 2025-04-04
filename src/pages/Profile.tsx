
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const logger = useLogger('ProfilePage', { category: 'AUTH' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      logger.info('Updating user profile', {
        details: { userId: user.id }
      });
      
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          avatar_url: avatarUrl
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
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Your Profile</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url} alt={displayName || user?.email || ''} />
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
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input 
                    id="avatar-url" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)} 
                    placeholder="https://example.com/your-avatar.jpg"
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
                    {roles.length > 0 
                      ? roles.join(', ') 
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
