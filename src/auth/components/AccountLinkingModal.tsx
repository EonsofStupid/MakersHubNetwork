
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Github } from 'lucide-react'; // Replace with correct imports

// Define component props
export interface AccountLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountLinkingModal: React.FC<AccountLinkingModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  // Callback handlers for provider linking
  const handleLinkGoogle = () => {
    // Implement Google account linking logic
    console.log('Linking Google account');
    onClose();
  };
  
  const handleLinkGithub = () => {
    // Implement GitHub account linking logic
    console.log('Linking GitHub account');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Your Accounts</DialogTitle>
          <DialogDescription>
            Connect your social accounts to enable single sign-on and additional features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 pt-4">
          <Button 
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleLinkGoogle}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.75 11.43h-2.69v2.69a.94.94 0 0 1-.93.93h-2.25a.94.94 0 0 1-.93-.93v-2.69H8.26a.94.94 0 0 1-.93-.93v-2.25c0-.51.42-.93.93-.93h2.69V6.63c0-.51.42-.93.93-.93h2.25c.51 0 .93.42.93.93v2.69h2.69c.51 0 .93.42.93.93v2.25c0 .51-.42.93-.93.93z"
              />
            </svg>
            <span>Link Google Account</span>
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleLinkGithub}
          >
            <Github size={20} />
            <span>Link GitHub Account</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
