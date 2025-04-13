
import React from 'react';
import { Bug } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useDebugStore } from '@/shared/stores/debug/debug.store';

export function AdminOverlayToggleButton({ className }: { className?: string }) {
  const { showAdminOverlay, toggleAdminOverlay } = useDebugStore();

  return (
    <button
      className={cn(
        'p-2 rounded transition-all',
        showAdminOverlay 
          ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
          : 'bg-gray-700 text-white hover:bg-gray-600',
        className
      )}
      onClick={toggleAdminOverlay}
      title="Toggle Admin Overlay"
    >
      <Bug className="w-4 h-4" />
    </button>
  );
}
