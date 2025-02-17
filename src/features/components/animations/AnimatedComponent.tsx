import { motion, AnimatePresence } from 'framer-motion';
import { useComponent } from '../hooks/useComponent';
import { getAnimationVariants, defaultAnimationConfig } from '../utils/animation-utils';
import { AnimatedComponentProps, ComponentHookConfig } from '../types';
import { cn } from '@/app/utils/cn';

interface AnimatedComponentWrapperProps extends AnimatedComponentProps {
  config?: ComponentHookConfig;
}

export const AnimatedComponent = ({
  animation = defaultAnimationConfig,
  className,
  children,
  config,
}: AnimatedComponentWrapperProps) => {
  const { state } = useComponent(config);
  const variants = getAnimationVariants(animation);

  return (
    <AnimatePresence mode="wait">
      {state.isVisible && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          className={cn(
            'relative',
            state.isDisabled && 'pointer-events-none opacity-50',
            className
          )}
        >
          {state.isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </motion.div>
          )}
          
          {children}

          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 left-0 right-0 p-2 bg-destructive/90 text-destructive-foreground text-sm rounded-b"
            >
              {state.error.message}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 