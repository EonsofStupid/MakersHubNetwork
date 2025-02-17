import { create } from 'zustand';
import { 
  NotificationStore, 
  NotificationConfig, 
  NotificationPosition, 
  NotificationAnimation 
} from '@/features/notifications/types';
import { generateNotificationId, mergeNotificationConfigs } from '@/features/notifications/utils/notification-utils';

const defaultConfig = {
  maxNotifications: 5,
  defaultDuration: 5000,
  defaultPosition: 'top-right' as NotificationPosition,
  defaultAnimation: 'fade' as NotificationAnimation,
};

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  ...defaultConfig,
  notifications: [],
  toasts: [],
  alerts: [],
  modals: [],

  add: (config) => {
    const id = config.id || generateNotificationId();
    const mergedConfig = mergeNotificationConfigs(
      {
        id,
        duration: get().defaultDuration,
        position: get().defaultPosition,
        animation: get().defaultAnimation,
        dismissible: true,
      },
      config
    );

    set((state) => {
      const notifications = [...state.notifications, mergedConfig];
      // Remove oldest notifications if exceeding max
      if (notifications.length > state.maxNotifications) {
        notifications.shift();
      }
      return { notifications };
    });

    // Auto-dismiss if duration is set
    if (mergedConfig.duration && mergedConfig.duration > 0) {
      setTimeout(() => {
        get().remove(id);
      }, mergedConfig.duration);
    }

    return id;
  },

  update: (id, config) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, ...config } : n
      ),
      toasts: state.toasts.map((n) =>
        n.id === id ? { ...n, ...config } : n
      ),
      alerts: state.alerts.map((n) =>
        n.id === id ? { ...n, ...config } : n
      ),
      modals: state.modals.map((n) =>
        n.id === id ? { ...n, ...config } : n
      ),
    }));
  },

  remove: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      toasts: state.toasts.filter((n) => n.id !== id),
      alerts: state.alerts.filter((n) => n.id !== id),
      modals: state.modals.filter((n) => n.id !== id),
    }));
  },

  removeAll: () => {
    set({
      notifications: [],
      toasts: [],
      alerts: [],
      modals: [],
    });
  },

  setConfig: (config) => {
    set((state) => ({ ...state, ...config }));
  },
})); 