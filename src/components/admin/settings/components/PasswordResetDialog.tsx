import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, RefreshCw, Key, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

export const PasswordResetDialog = ({ open, onOpenChange, userEmail }: PasswordResetDialogProps) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handlePasswordReset = async () => {
    try {
      setIsResetting(true);
      setResetStatus('sending');
      
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Error sending reset email:', error);
        setResetStatus('error');
        toast.error('Failed to send reset email', {
          description: error.message
        });
        return;
      }

      setResetStatus('success');
      toast.success('Password reset email sent successfully', {
        description: 'Please check your email inbox'
      });
      
      // Close dialog after a short delay on success
      setTimeout(() => {
        onOpenChange(false);
        setResetStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error('Error in password reset:', error);
      setResetStatus('error');
      toast.error('Failed to process password reset');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-zinc-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-[#41f0db]" />
            Reset User Password
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Send a password reset email to {userEmail}
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={resetStatus}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-4"
          >
            {resetStatus === 'idle' && (
              <p className="text-sm text-zinc-400">
                This will send an email to the user with instructions to reset their password.
                The link will expire in 24 hours.
              </p>
            )}
            
            {resetStatus === 'sending' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#41f0db]" />
                <p className="text-sm text-zinc-400">Sending reset instructions...</p>
              </div>
            )}
            
            {resetStatus === 'success' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </motion.div>
                <p className="text-sm text-green-500">Reset email sent successfully!</p>
              </div>
            )}
            
            {resetStatus === 'error' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <RefreshCw className="h-8 w-8 text-red-500" />
                <p className="text-sm text-red-500">Failed to send reset email. Please try again.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setResetStatus('idle');
            }}
            className="mr-2"
            disabled={isResetting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordReset}
            disabled={isResetting || resetStatus === 'success'}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Email'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};