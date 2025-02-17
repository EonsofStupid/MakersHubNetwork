import { ReactNode } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPosition = 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
export type NotificationAnimation = 'fade' | 'slide' | 'bounce';

export interface NotificationConfig {
  id?: string;
  title?: string;
  description: string;
  type?: NotificationType;
  duration?: number;
  position?: NotificationPosition;
  animation?: NotificationAnimation;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  dismissible?: boolean;
  preserveOnRouteChange?: boolean;
}

export interface NotificationState {
  notifications: NotificationConfig[];
  toasts: NotificationConfig[];
  alerts: NotificationConfig[];
  modals: NotificationConfig[];
}

export interface NotificationContextValue extends NotificationState {
  show: (config: NotificationConfig) => string;
  showToast: (config: NotificationConfig) => string;
  showAlert: (config: NotificationConfig) => string;
  showModal: (config: NotificationConfig) => string;
  update: (id: string, config: Partial<NotificationConfig>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  defaultPosition?: NotificationPosition;
  defaultAnimation?: NotificationAnimation;
}

export interface NotificationItemProps {
  config: NotificationConfig;
  onDismiss: () => void;
  className?: string;
}

export interface NotificationContainerProps {
  position: NotificationPosition;
  notifications: NotificationConfig[];
  onDismiss: (id: string) => void;
  className?: string;
}

export interface NotificationStoreState extends NotificationState {
  maxNotifications: number;
  defaultDuration: number;
  defaultPosition: NotificationPosition;
  defaultAnimation: NotificationAnimation;
}

export interface NotificationStoreActions {
  add: (config: NotificationConfig) => string;
  update: (id: string, config: Partial<NotificationConfig>) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  setConfig: (config: Partial<NotificationStoreState>) => void;
}

export type NotificationStore = NotificationStoreState & NotificationStoreActions; 