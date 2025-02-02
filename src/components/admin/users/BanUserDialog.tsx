import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BanUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  username: string;
}

export const BanUserDialog = ({ isOpen, onClose, onConfirm, username }: BanUserDialogProps) => {
  const [reason, setReason] = React.useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Ban User: {username}</DialogTitle>
          <DialogDescription className="text-gray-400">
            This action will prevent the user from accessing their account. Please provide a reason for the ban.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for ban..."
            className="bg-gray-700/50 border-gray-600 text-white min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
            disabled={!reason}
          >
            Confirm Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};