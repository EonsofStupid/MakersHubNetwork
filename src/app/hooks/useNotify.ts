import { useCallback } from 'react';
import { NotificationConfig } from '@/features/notifications/types';
import { useNotificationStore } from '@/app/stores/notifications/store';

export const useNotify = () => {
  const store = useNotificationStore();

  const notify = useCallback(
    (config: NotificationConfig) => store.add(config),
    [store]
  );

  const toast = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) =>
      store.add({
        description: message,
        duration: 3000,
        ...config,
      }),
    [store]
  );

  const success = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) =>
      toast(message, { type: 'success', ...config }),
    [toast]
  );

  const error = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) =>
      toast(message, { type: 'error', ...config }),
    [toast]
  );

  const warning = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) =>
      toast(message, { type: 'warning', ...config }),
    [toast]
  );

  const info = useCallback(
    (message: string, config: Partial<NotificationConfig> = {}) =>
      toast(message, { type: 'info', ...config }),
    [toast]
  );

  const alert = useCallback(
    (config: NotificationConfig) => {
      return store.add({
        position: 'top',
        animation: 'slide',
        duration: 0,
        dismissible: true,
        ...config,
      });
    },
    [store]
  );

  const modal = useCallback(
    (config: NotificationConfig) => {
      return store.add({
        position: 'center',
        animation: 'fade',
        duration: 0,
        dismissible: true,
        ...config,
      });
    },
    [store]
  );

  const dismiss = useCallback(
    (id: string) => store.remove(id),
    [store]
  );

  const dismissAll = useCallback(
    () => store.removeAll(),
    [store]
  );

  return {
    notify,
    toast,
    success,
    error,
    warning,
    info,
    alert,
    modal,
    dismiss,
    dismissAll,
  };
}; 