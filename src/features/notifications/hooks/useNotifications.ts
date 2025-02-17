import { useCallback, useEffect, useState } from 'react';
import {
  NotificationConfig,
  NotificationPosition,
  NotificationAnimation,
  NotificationStoreState,
} from '../types';
import {
  generateNotificationId,
  mergeNotificationConfigs,
} from '../utils/notification-utils';

const defaultState: NotificationStoreState = {
  notifications: [],
  toasts: [],
  alerts: [],
  modals: [],
  maxNotifications: 5,
  defaultDuration: 5000,
  defaultPosition: 'top-right',
  defaultAnimation: 'fade',
};

export const useNotifications = (
  config: Partial<NotificationStoreState> = {}
) => {
  const [state, setState] = useState<NotificationStoreState>({
    ...defaultState,
    ...config,
  });

  // Clean up expired notifications
  useEffect(() => {
    const timers = state.notifications
      .concat(state.toasts)
      .filter((n) => n.duration && n.duration > 0)
      .map((notification) => {
        return setTimeout(() => {
          remove(notification.id!);
        }, notification.duration);
      });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [state.notifications, state.toasts]);

  // Add a new notification
  const add = useCallback(
    (config: NotificationConfig): string => {
      const notification = mergeNotificationConfigs(
        {
          position: state.defaultPosition,
          animation: state.defaultAnimation,
          duration: state.defaultDuration,
        },
        config
      );

      setState((prev) => {
        // Remove oldest notification if we're at max capacity
        const notifications = [...prev.notifications];
        if (notifications.length >= prev.maxNotifications) {
          notifications.shift();
        }

        return {
          ...prev,
          notifications: [...notifications, notification],
        };
      });

      return notification.id!;
    },
    [state.defaultPosition, state.defaultAnimation, state.defaultDuration]
  );

  // Add a toast notification
  const addToast = useCallback(
    (config: NotificationConfig): string => {
      const notification = mergeNotificationConfigs(
        {
          position: state.defaultPosition,
          animation: state.defaultAnimation,
          duration: state.defaultDuration,
        },
        config
      );

      setState((prev) => {
        const toasts = [...prev.toasts];
        if (toasts.length >= prev.maxNotifications) {
          toasts.shift();
        }

        return {
          ...prev,
          toasts: [...toasts, notification],
        };
      });

      return notification.id!;
    },
    [state.defaultPosition, state.defaultAnimation, state.defaultDuration]
  );

  // Add an alert notification
  const addAlert = useCallback(
    (config: NotificationConfig): string => {
      const notification = mergeNotificationConfigs(
        {
          position: 'top',
          animation: 'slide',
          duration: 0, // Alerts don't auto-dismiss by default
          dismissible: true,
        },
        config
      );

      setState((prev) => ({
        ...prev,
        alerts: [...prev.alerts, notification],
      }));

      return notification.id!;
    },
    []
  );

  // Add a modal notification
  const addModal = useCallback(
    (config: NotificationConfig): string => {
      const notification = mergeNotificationConfigs(
        {
          position: 'center',
          animation: 'fade',
          duration: 0, // Modals don't auto-dismiss
          dismissible: true,
        },
        config
      );

      setState((prev) => ({
        ...prev,
        modals: [...prev.modals, notification],
      }));

      return notification.id!;
    },
    []
  );

  // Update an existing notification
  const update = useCallback(
    (id: string, config: Partial<NotificationConfig>) => {
      setState((prev) => {
        const updateNotifications = (
          notifications: NotificationConfig[]
        ): NotificationConfig[] => {
          return notifications.map((n) =>
            n.id === id ? { ...n, ...config } : n
          );
        };

        return {
          ...prev,
          notifications: updateNotifications(prev.notifications),
          toasts: updateNotifications(prev.toasts),
          alerts: updateNotifications(prev.alerts),
          modals: updateNotifications(prev.modals),
        };
      });
    },
    []
  );

  // Remove a notification
  const remove = useCallback((id: string) => {
    setState((prev) => {
      const filterNotifications = (notifications: NotificationConfig[]) =>
        notifications.filter((n) => n.id !== id);

      return {
        ...prev,
        notifications: filterNotifications(prev.notifications),
        toasts: filterNotifications(prev.toasts),
        alerts: filterNotifications(prev.alerts),
        modals: filterNotifications(prev.modals),
      };
    });
  }, []);

  // Remove all notifications
  const removeAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: [],
      toasts: [],
      alerts: [],
      modals: [],
    }));
  }, []);

  // Update configuration
  const setConfig = useCallback(
    (config: Partial<NotificationStoreState>) => {
      setState((prev) => ({
        ...prev,
        ...config,
      }));
    },
    []
  );

  return {
    ...state,
    add,
    addToast,
    addAlert,
    addModal,
    update,
    remove,
    removeAll,
    setConfig,
  };
}; 