import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SchedulePreviewProps {
  selectedDate: Date;
  selectedTime: string;
}

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({
  selectedDate,
  selectedTime
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg"
    >
      <div className="flex items-center gap-2 text-white">
        <CheckCircle className="w-4 h-4 text-neon-cyan" />
        <span>Will be published on:</span>
      </div>
      <p className="mt-1 text-neon-cyan">
        {format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
      </p>
    </motion.div>
  );
};