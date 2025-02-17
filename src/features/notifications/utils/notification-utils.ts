import { NotificationConfig, NotificationPosition, NotificationAnimation } from '../types';

export const getPositionStyles = (position: NotificationPosition): string => {
  switch (position) {
    case 'top':
      return 'top-0 left-1/2 -translate-x-1/2';
    case 'bottom':
      return 'bottom-0 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-0 right-0';
    case 'top-left':
      return 'top-0 left-0';
    case 'bottom-right':
      return 'bottom-0 right-0';
    case 'bottom-left':
      return 'bottom-0 left-0';
    default:
      return 'top-0 right-0';
  }
};

export const getAnimationVariants = (
  animation: NotificationAnimation,
  position: NotificationPosition
) => {
  const isTop = position.startsWith('top');
  const isBottom = position.startsWith('bottom');
  const isRight = position.endsWith('right');
  const isLeft = position.endsWith('left');

  switch (animation) {
    case 'slide':
      return {
        initial: {
          opacity: 0,
          x: isRight ? 100 : isLeft ? -100 : 0,
          y: isTop ? -100 : isBottom ? 100 : 0,
        },
        animate: {
          opacity: 1,
          x: 0,
          y: 0,
        },
        exit: {
          opacity: 0,
          x: isRight ? 100 : isLeft ? -100 : 0,
          y: isTop ? -100 : isBottom ? 100 : 0,
        },
      };

    case 'bounce':
      return {
        initial: {
          opacity: 0,
          scale: 0.9,
          x: isRight ? 20 : isLeft ? -20 : 0,
          y: isTop ? -20 : isBottom ? 20 : 0,
        },
        animate: {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          x: isRight ? 20 : isLeft ? -20 : 0,
          y: isTop ? -20 : isBottom ? 20 : 0,
        },
      };

    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
};

export const getNotificationIcon = (type: NotificationConfig['type']) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
    default:
      return 'ℹ';
  }
};

export const getNotificationColors = (type: NotificationConfig['type']) => {
  switch (type) {
    case 'success':
      return {
        background: 'bg-success/10',
        border: 'border-success/20',
        text: 'text-success',
        icon: 'text-success',
      };
    case 'error':
      return {
        background: 'bg-destructive/10',
        border: 'border-destructive/20',
        text: 'text-destructive',
        icon: 'text-destructive',
      };
    case 'warning':
      return {
        background: 'bg-warning/10',
        border: 'border-warning/20',
        text: 'text-warning',
        icon: 'text-warning',
      };
    case 'info':
    default:
      return {
        background: 'bg-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
        icon: 'text-primary',
      };
  }
};

export const groupNotificationsByPosition = (
  notifications: NotificationConfig[]
): Record<NotificationPosition, NotificationConfig[]> => {
  return notifications.reduce(
    (acc, notification) => {
      const position = notification.position || 'top-right';
      return {
        ...acc,
        [position]: [...(acc[position] || []), notification],
      };
    },
    {} as Record<NotificationPosition, NotificationConfig[]>
  );
};

export const generateNotificationId = (): string => {
  return `notification-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const mergeNotificationConfigs = (
  defaultConfig: Partial<NotificationConfig>,
  config: NotificationConfig
): NotificationConfig => {
  return {
    id: generateNotificationId(),
    type: 'info',
    duration: 5000,
    dismissible: true,
    preserveOnRouteChange: false,
    ...defaultConfig,
    ...config,
  };
}; 