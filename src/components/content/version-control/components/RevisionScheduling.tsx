import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from 'lucide-react';
import { SchedulingInterface } from './scheduling/SchedulingInterface';
import { QueueProcessor } from './scheduling/QueueProcessor';

interface RevisionSchedulingProps {
  contentId: string;
  revisionId: string;
}

export const RevisionScheduling: React.FC<RevisionSchedulingProps> = ({
  contentId,
  revisionId
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="text-white/70 border-white/10 hover:bg-white/5 hover:text-neon-cyan hover:border-neon-cyan/50"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Schedule
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Schedule Publication</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <SchedulingInterface
              contentId={contentId}
              revisionId={revisionId}
              onSchedule={() => setIsOpen(false)}
            />
            <QueueProcessor />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};