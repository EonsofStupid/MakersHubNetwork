
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/core/dialog';
import { ProfileEditor } from '@/admin/components/profile/ProfileEditor';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { UserProfile } from '@/types/user';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const logger = useLogger('ProfileDialog', LogCategory.UI);
  
  const handleSave = async (updatedProfile: Partial<UserProfile>) => {
    try {
      logger.info('Saving profile', { 
        details: { updatedProfile } 
      });
      
      // In a real implementation, you would save to the database here
      
      toast({
        title: 'Profile updated',
        description: 'Your profile changes have been saved.',
        variant: 'default',
      });
      
      onClose();
    } catch (error) {
      logger.error('Failed to save profile', { 
        details: { error }
      });
      
      toast({
        title: 'Error saving profile',
        description: 'Your profile changes could not be saved.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <ProfileEditor 
          profile={profile as UserProfile} 
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
