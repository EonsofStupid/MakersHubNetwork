
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { adminDebugModeAtom } from '@/admin/atoms/tools.atoms';
import { Wrench } from 'lucide-react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { cn } from '@/lib/utils';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { inspectorVisibleAtom } from '@/admin/store/atoms/inspector.atoms';

export function DebugOverlay() {
  const [isDebugMode, setDebugMode] = useAtom(adminDebugModeAtom);
  const [isInspectorVisible, setInspectorVisible] = useAtom(inspectorVisibleAtom);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const { isSuperAdmin } = useAuthState();
  const logger = useLogger('DebugOverlay', LogCategory.ADMIN);

  // Add keyboard listener for Alt key to toggle component inspection
  useEffect(() => {
    if (!isSuperAdmin && !isDebugMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(true);
        logger.debug('Alt key pressed - debug inspection active', {
          details: { isDebugMode }
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
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
  }, [isSuperAdmin, isDebugMode, isAltPressed, logger, setInspectorVisible]);

  // Don't render anything if user is not a super admin and debug mode is not enabled
  if (!isSuperAdmin && !isDebugMode) {
    return null;
  }

  const toggleDebugMode = () => {
    logger.info('Toggling debug mode', {
      details: { current: isDebugMode, new: !isDebugMode }
    });
    setDebugMode(!isDebugMode);
  };

  return (
    <>
      {/* Debug Mode Toggle Button */}
      <button
        onClick={toggleDebugMode}
        className={cn(
          "fixed bottom-4 right-4 z-50 p-2 rounded-full shadow-lg",
          "transition-all duration-300 transform hover:scale-110",
          isDebugMode 
            ? "bg-red-500 text-white hover:bg-red-600" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        <Wrench className="h-5 w-5" />
      </button>

      {/* Render debug components on all elements when in debug mode */}
      {isDebugMode && (
        <div className="debug-system fixed top-0 left-0 right-0 z-40 pointer-events-none">
          <div className="debug-info fixed top-0 left-0 bg-black/80 text-primary p-2 text-xs max-w-[300px] pointer-events-auto">
            <h3 className="font-bold">Debug Mode Active</h3>
            <p className="text-primary/80 text-xs">Hold Alt + Click to inspect components</p>
            <p className="text-primary/60 text-xs mt-1">Press Alt to highlight components</p>
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
        `}</style>
      )}
    </>
  );
}
