
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProfileEditor } from './ProfileEditor';
import { User } from '@/types/user';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

export function ProfileDialog({ open, onClose, user }: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <ProfileEditor onClose={onClose} user={user} />
      </DialogContent>
    </Dialog>
  );
}
