import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/integrations/supabase/client';

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
      <div className="flex items-center gap-2 text-white">
        <CalendarIcon className="w-5 h-5 text-neon-cyan" />
        <h3 className="text-lg font-semibold">Schedule Publication</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white/70">Select Date</Label>
          <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="bg-transparent"
            />
          </div>
        </div>

        <div>
          <Label className="text-white/70">Select Time</Label>
          <div className="relative mt-2">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        {selectedDate && selectedTime && (
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
      </div>
    </motion.div>
  );
};