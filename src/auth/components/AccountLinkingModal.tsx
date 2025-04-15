
import React from 'react';

interface AccountLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountLinkingModal: React.FC<AccountLinkingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Link Accounts</h2>
        <p className="mb-4">Link your current account with other sign-in methods to access your account in different ways.</p>
        
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Link Account
          </button>
        </div>
      </div>
    </div>
  );
};
