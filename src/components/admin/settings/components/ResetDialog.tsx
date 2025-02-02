import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  isResetting: boolean;
  resetConfirmation: string;
  onResetConfirmationChange: (value: string) => void;
  confirmCheckbox: boolean;
  onConfirmCheckboxChange: (checked: boolean) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export const ResetDialog: React.FC<ResetDialogProps> = ({
  open,
  onOpenChange,
  onReset,
  isResetting,
  resetConfirmation,
  onResetConfirmationChange,
  confirmCheckbox,
  onConfirmCheckboxChange,
  onKeyPress,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/95 border border-red-500/20">
        <DialogHeader>
          <DialogTitle className="text-red-400">⚠️ Reset All Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            This will reset ALL settings to their default values. This includes colors, fonts, animations, and custom CSS.
            This action cannot be undone. Type IMPULSE and check the box to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-confirmation" className="text-white">Type IMPULSE to confirm</Label>
            <Input
              id="reset-confirmation"
              value={resetConfirmation}
              onChange={(e) => onResetConfirmationChange(e.target.value)}
              onKeyPress={onKeyPress}
              className="bg-gray-700/50 border-gray-600"
              placeholder="IMPULSE"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-reset"
              checked={confirmCheckbox}
              onCheckedChange={(checked) => onConfirmCheckboxChange(checked as boolean)}
            />
            <Label htmlFor="confirm-reset" className="text-white">
              I understand this will reset all settings and cannot be undone
            </Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onReset}
              disabled={isResetting || !confirmCheckbox || resetConfirmation.toUpperCase() !== "IMPULSE"}
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset All Settings"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};