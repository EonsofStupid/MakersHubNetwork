
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserProfile } from '@/shared/types/shared.types';
import { useToast } from '@/shared/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

const profileSchema = z.object({
  display_name: z.string().min(2, { message: 'Display name must be at least 2 characters.' }),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  onClose?: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { toast } = useToast();
  const updateUserProfile = useAuthStore(state => state.updateUserProfile);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const logger = useLogger('ProfileEditor', LogCategory.AUTH);
  
  const [isLoading, setIsLoading] = useState(false);

  // Use profile from auth store, fallback to empty values
  const defaultValues: ProfileFormValues = {
    display_name: profile?.display_name || user?.user_metadata?.full_name || '',
    avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      logger.info('Submitting profile update', { details: data });
      
      await updateUserProfile(data as Partial<UserProfile>);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
      
      onClose?.();
    } catch (error) {
      logger.error('Failed to update profile', { 
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error', 
        } 
      });
      
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'An error occurred while updating your profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={form.watch('avatar_url') || undefined} alt="User avatar" />
            <AvatarFallback className="text-lg">
              {form.watch('display_name')?.substring(0, 2)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/avatar.png" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="A short bio about yourself" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://yoursite.com" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="City, Country" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
