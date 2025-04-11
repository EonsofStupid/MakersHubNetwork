
import React from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  avatarUrl: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileEditor() {
  const { user, profile } = useAuthState();
  const { toast } = useToast();
  const logger = useLogger('ProfileEditor', LogCategory.UI);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.display_name || user?.user_metadata?.full_name as string || '',
      avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url as string || '',
      bio: profile?.bio || '',
    },
  });
  
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      logger.info('Updating profile', { details: values });
      
      // Here you would actually update the profile
      // For now, just simulate success
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error) {
      logger.error('Error updating profile', { 
        details: error instanceof Error ? error.message : String(error) 
      });
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea 
                  {...field} 
                  placeholder="Tell us a little about yourself" 
                  className="resize-none"
                  maxLength={160}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Save Profile</Button>
      </form>
    </Form>
  );
}
