import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, History } from 'lucide-react';

interface VersionSelectorProps {
  versionNumber: number;
  maxVersion: number;
  onVersionChange: (increment: boolean) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  versionNumber,
  maxVersion,
  onVersionChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Version {versionNumber}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVersionChange(false)}
          disabled={versionNumber <= 1}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVersionChange(true)}
          disabled={versionNumber >= maxVersion}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};