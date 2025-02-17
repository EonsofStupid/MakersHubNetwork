import { AnimatePresence } from 'framer-motion';
import { NotificationContainerProps } from '../types';
import { NotificationItem } from './NotificationItem';
import { getPositionStyles } from '../utils/notification-utils';
import { cn } from '@/app/utils/cn';

export const NotificationContainer = ({
  position,
  notifications,
  onDismiss,
  className,
}: NotificationContainerProps) => {
  const positionClasses = getPositionStyles(position);

  return (
    <div
      className={cn(
        'fixed z-50 p-4 space-y-4 pointer-events-none',
        'max-h-screen overflow-hidden',
        positionClasses,
        className
      )}
    >
      <AnimatePresence mode="sync">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem
              config={notification}
              onDismiss={() => {
                notification.onClose?.();
                onDismiss(notification.id!);
              }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 