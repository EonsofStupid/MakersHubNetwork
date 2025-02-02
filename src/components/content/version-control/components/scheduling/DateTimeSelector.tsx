import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white/70">Select Date</Label>
        <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
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
            onChange={(e) => onTimeChange(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>
    </div>
  );
};