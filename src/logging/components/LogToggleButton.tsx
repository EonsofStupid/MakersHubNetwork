
import React from 'react';
import { Terminal, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface LogToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const LogToggleButton: React.FC<LogToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 z-50 rounded-full"
      onClick={onClick}
    >
      {isOpen ? <X size={20} /> : <Terminal size={20} />}
    </Button>
  );
};
