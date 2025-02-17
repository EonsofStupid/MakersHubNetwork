import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { NotificationItemProps } from '../types';
import { getNotificationColors, getNotificationIcon, getAnimationVariants } from '../utils/notification-utils';
import { cn } from '@/app/utils/cn';

export const NotificationItem = ({
  config,
  onDismiss,
  className,
}: NotificationItemProps) => {
  const colors = getNotificationColors(config.type);
  const icon = config.icon || getNotificationIcon(config.type);
  const variants = getAnimationVariants(
    config.animation || 'fade',
    config.position || 'top-right'
  );

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={cn(
        'relative flex items-start gap-4 p-4 rounded-lg shadow-lg',
        'backdrop-blur-xl border',
        colors.background,
        colors.border,
        className
      )}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 w-5 h-5', colors.icon)}>
        {typeof icon === 'string' ? (
          <span className="text-lg">{icon}</span>
        ) : (
          icon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {config.title && (
          <h3 className={cn('text-sm font-medium', colors.text)}>
            {config.title}
          </h3>
        )}
        <p
          className={cn(
            'text-sm',
            config.title ? 'text-muted-foreground mt-1' : colors.text
          )}
        >
          {config.description}
        </p>
        {config.action && (
          <button
            onClick={config.action.onClick}
            className={cn(
              'mt-2 text-sm font-medium underline',
              colors.text
            )}
          >
            {config.action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      {config.dismissible && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 w-5 h-5 p-0.5',
            'hover:bg-foreground/5 rounded',
            'transition-colors duration-200',
            colors.text
          )}
          aria-label="Dismiss notification"
        >
          <X className="w-full h-full" />
        </button>
      )}
    </motion.div>
  );
}; 