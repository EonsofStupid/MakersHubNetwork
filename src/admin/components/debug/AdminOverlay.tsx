
import React, { useEffect } from 'react';
import { useDebugStore } from '@/shared/stores/debug/debug.store';
import { useHasRole } from '@/auth/hooks/useHasRole';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

export default function AdminOverlay() {
  const { showAdminOverlay } = useDebugStore();
  const { hasAdminAccess } = useHasRole();
  const logger = useLogger('AdminOverlay', LogCategory.ADMIN);
  
  // Listen for keyboard shortcut Ctrl+Shift+A to toggle the overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === 'a'
      ) {
        e.preventDefault();
        useDebugStore.getState().toggleAdminOverlay();
        logger.info('Admin overlay toggled via keyboard shortcut');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [logger]);
  
  // Don't render anything if overlay is disabled or user doesn't have admin access
  if (!showAdminOverlay || !hasAdminAccess()) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Debug Styling Layer */}
      <div className="absolute inset-0 border-4 border-pink-500 border-dashed opacity-30" />

      {/* Info Panel */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-lg pointer-events-auto">
        <h2 className="font-bold mb-2">Admin Debug Mode</h2>
        <ul className="text-sm space-y-1">
          <li>👤 Role: Admin</li>
          <li>🧠 State: Active</li>
          <li>📝 Page: {window.location.pathname}</li>
          <li>⏱️ Time: {new Date().toLocaleTimeString()}</li>
        </ul>
        <div className="mt-3 border-t border-white/20 pt-2">
          <p className="text-xs text-white/60">Press Ctrl+Shift+A to toggle</p>
        </div>
      </div>
    </div>
  );
}
