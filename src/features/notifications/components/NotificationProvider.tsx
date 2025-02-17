import { createContext, useContext } from 'react';
import {
  NotificationContextValue,
  NotificationProviderProps,
  NotificationPosition,
} from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationContainer } from './NotificationContainer';
import { groupNotificationsByPosition } from '../utils/notification-utils';

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
  defaultPosition = 'top-right',
  defaultAnimation = 'fade',
}: NotificationProviderProps) => {
  const {
    notifications,
    toasts,
    alerts,
    modals,
    add: addNotification,
    addToast,
    addAlert,
    addModal,
    update,
    remove,
    removeAll,
  } = useNotifications({
    maxNotifications,
    defaultDuration,
    defaultPosition,
    defaultAnimation,
  });

  // Group notifications by position
  const notificationsByPosition = groupNotificationsByPosition(notifications);
  const toastsByPosition = groupNotificationsByPosition(toasts);
  const alertsByPosition = groupNotificationsByPosition(alerts);

  // Combine all positions
  const allPositions = new Set<NotificationPosition>([
    ...Object.keys(notificationsByPosition),
    ...Object.keys(toastsByPosition),
    ...Object.keys(alertsByPosition),
  ] as NotificationPosition[]);

  const value: NotificationContextValue = {
    notifications,
    toasts,
    alerts,
    modals,
    show: addNotification,
    showToast: addToast,
    showAlert: addAlert,
    showModal: addModal,
    update,
    dismiss: remove,
    dismissAll: removeAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {/* Render notification containers for each position */}
      {Array.from(allPositions).map((position) => (
        <NotificationContainer
          key={position}
          position={position}
          notifications={[
            ...(notificationsByPosition[position] || []),
            ...(toastsByPosition[position] || []),
            ...(alertsByPosition[position] || []),
          ]}
          onDismiss={remove}
        />
      ))}

      {/* Render modals in the center */}
      {modals.length > 0 && (
        <NotificationContainer
          position="center"
          notifications={modals}
          onDismiss={remove}
          className="flex items-center justify-center"
        />
      )}

      {children}
    </NotificationContext.Provider>
  );
}; 