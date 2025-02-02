import React from 'react';
import { Monitor } from 'lucide-react';

interface CyberpunkViewerButtonProps {
  onClick: () => void;
  className?: string;
}

const CyberpunkViewerButton: React.FC<CyberpunkViewerButtonProps> = ({
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#41f0db] hover:text-[#41f0db]/80 transition-colors ${className}`}
    >
      <Monitor className="w-4 h-4" />
      <span>View in Cyberpunk Mode</span>
    </button>
  );
};

export default CyberpunkViewerButton;