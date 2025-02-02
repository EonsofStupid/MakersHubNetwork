import React from 'react';
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface ActivityOverviewProps {
  lastThreadDate?: string | null;
  lastReplyDate?: string | null;
  lastBuildDate?: string | null;
}

export const ActivityOverview: React.FC<ActivityOverviewProps> = ({
  lastThreadDate,
  lastReplyDate,
  lastBuildDate
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Last Thread: {lastThreadDate ? formatDistanceToNow(new Date(lastThreadDate), { addSuffix: true }) : 'No threads yet'}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Last Reply: {lastReplyDate ? formatDistanceToNow(new Date(lastReplyDate), { addSuffix: true }) : 'No replies yet'}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Last Build: {lastBuildDate ? formatDistanceToNow(new Date(lastBuildDate), { addSuffix: true }) : 'No builds yet'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ActivityOverview;