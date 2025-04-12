
import React, { useEffect } from 'react';
import { Wrench } from 'lucide-react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { cn } from '@/lib/utils';
import { ComponentWrapper } from '@/admin/components/debug/ComponentWrapper';
import { useDebugStore } from '@/shared/store/debug.store';
import { useHasRole } from '@/auth/hooks/useHasRole';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';

export function DebugOverlay() {
  // Use our new role checking hook
  const { hasAdminAccess } = useHasRole();
  const { isSuperAdmin } = useAdminPermissions();
  
  // Use the debug store
  const { 
    isDebugMode, 
    toggleDebugMode, 
    isAltPressed, 
    setAltPressed,
    isInspectorVisible,
    setInspectorVisible,
    hoveredElement,
    setHoveredElement
  } = useDebugStore();
  
  const logger = useLogger('DebugOverlay', LogCategory.ADMIN);

  // Add keyboard listener for Alt key to toggle component inspection
  useEffect(() => {
    if (!hasAdminAccess() && !isDebugMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt key for inspection mode
      if (e.key === 'Alt') {
        setAltPressed(true);
        logger.debug('Alt key pressed - debug inspection active', {
          details: { isDebugMode }
        });
      }
      
      // Keyboard shortcut for toggling debug mode (Shift+Ctrl+D or Shift+Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleDebugMode();
        logger.info('Debug mode toggled via keyboard shortcut', {
          details: { newState: !isDebugMode }
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltPressed(false);
        logger.debug('Alt key released - debug inspection inactive');
      }
    };

    // Add global click handler for component inspection when Alt is pressed
    const handleClick = (e: MouseEvent) => {
      if (isAltPressed && isDebugMode) {
        // Find closest element with data-component attribute
        let target = e.target as HTMLElement | null;
        while (target && !target.dataset.component) {
          target = target.parentElement;
        }

        if (target?.dataset.component) {
          e.preventDefault();
          e.stopPropagation();
          setHoveredElement(target);
          setInspectorVisible(true);
          logger.info('Component inspected', { 
            details: { 
              component: target.dataset.component,
              componentId: target.dataset.componentId
            }
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleClick, true);
    };
  }, [
    hasAdminAccess, 
    isDebugMode, 
    isAltPressed, 
    logger, 
    setAltPressed, 
    toggleDebugMode, 
    setInspectorVisible,
    setHoveredElement
  ]);

  // Don't render anything if user doesn't have admin access and debug mode is not enabled
  if (!hasAdminAccess() && !isDebugMode) {
    return null;
  }

  return (
    <>
      {/* Debug Mode Toggle Button */}
      <ComponentWrapper componentName="DebugToggle">
        <button
          onClick={toggleDebugMode}
          className={cn(
            "fixed bottom-16 right-4 z-50 p-2 rounded-full shadow-lg",
            "transition-all duration-300 transform hover:scale-110",
            isDebugMode 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Wrench className="h-5 w-5" />
        </button>
      </ComponentWrapper>

      {/* Render debug components on all elements when in debug mode */}
      {isDebugMode && (
        <div className="debug-system fixed top-0 left-0 right-0 z-40 pointer-events-none">
          <div className="debug-info fixed top-0 left-0 bg-black/80 text-primary p-2 text-xs max-w-[300px] pointer-events-auto">
            <h3 className="font-bold">Debug Mode Active</h3>
            <p className="text-primary/80 text-xs">Hold Alt + Click to inspect components</p>
            <p className="text-primary/60 text-xs mt-1">Press Shift+Ctrl+D to toggle debug mode</p>
            {isSuperAdmin() && (
              <p className="text-green-400 text-xs mt-1">SuperAdmin access granted</p>
            )}
          </div>
        </div>
      )}
      
      {/* Add debug indicators to components */}
      {isDebugMode && (
        <style>{`
          [data-component]:hover::after {
            content: '🔧';
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--impulse-primary);
            color: var(--impulse-bg-main);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 100;
            animation: pulse 2s infinite;
          }
          
          ${isAltPressed ? `
          [data-component] {
            outline: 2px dashed var(--impulse-primary);
            position: relative;
            z-index: 1;
          }
          ` : ''}
          
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          
          @keyframes shimmer {
            to {
              transform: translateX(100%);
            }
          }
        `}</style>
      )}
    </>
  );
}
