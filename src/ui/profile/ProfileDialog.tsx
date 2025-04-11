
import { User } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/core/dialog";
import { ProfileEditor } from "./ProfileEditor";

interface ProfileDialogProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function ProfileDialog({ user, open, onClose }: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <ProfileEditor user={user} onSave={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
