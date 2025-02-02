import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/integrations/supabase/client';
import { DateTimeSelector } from './DateTimeSelector';
import { SchedulePreview } from './SchedulePreview';

interface SchedulingInterfaceProps {
  contentId: string;
  revisionId: string;
  onSchedule: () => void;
}

export const SchedulingInterface: React.FC<SchedulingInterfaceProps> = ({
  contentId,
  revisionId,
  onSchedule
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useAuthStore();

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !user) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      setIsSubmitting(true);
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('publishing_queue')
        .insert({
          revision_id: revisionId,
          content_id: contentId,
          scheduled_for: scheduledDateTime.toISOString(),
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Publication scheduled successfully');
      onSchedule();
    } catch (error) {
      console.error('Error scheduling publication:', error);
      toast.error('Failed to schedule publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg"
    >
      <DateTimeSelector
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
      />

      {selectedDate && selectedTime && (
        <SchedulePreview
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      )}

      <Button
        onClick={handleSchedule}
        disabled={!selectedDate || !selectedTime || isSubmitting}
        className="w-full bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          'Schedule Publication'
        )}
      </Button>
    </motion.div>
  );
};