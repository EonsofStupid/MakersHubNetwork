
import { User } from "@/shared/types/user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/core/dialog";
import { ProfileEditor } from "./ProfileEditor";

export interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

export function ProfileDialog({ open, onClose, user }: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <ProfileEditor onClose={onClose} user={user} />
      </DialogContent>
    </Dialog>
  );
}
