import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { History, AlertTriangle } from 'lucide-react';

interface RollbackConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  versionNumber: number;
}

export const RollbackConfirmation: React.FC<RollbackConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  versionNumber,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-warning" />
            Confirm Rollback
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-start gap-2 text-warning">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <p>
                You are about to rollback to version {versionNumber}. This action will create a new
                revision with the content from version {versionNumber}.
              </p>
            </div>
            <p>Are you sure you want to proceed?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm Rollback</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};