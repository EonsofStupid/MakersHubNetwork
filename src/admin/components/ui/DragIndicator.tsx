
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { dropIndicatorPositionAtom, isDraggingAtom } from '@/admin/atoms/tools.atoms';

export const DragIndicator: React.FC = () => {
  const [isDragging] = useAtom(isDraggingAtom);
  const [position] = useAtom(dropIndicatorPositionAtom);

  return (
    <AnimatePresence>
      {isDragging && position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            left: position.x - 10,
            top: position.y - 10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--impulse-primary)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              position: 'absolute',
              inset: -5,
              borderRadius: '50%',
              border: '2px solid var(--impulse-primary)',
              opacity: 0.7,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
