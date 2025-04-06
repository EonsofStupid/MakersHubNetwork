
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    user: 'John Doe',
    action: 'Created a new build',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: 'Jane Smith',
    action: 'Updated profile settings',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    user: 'Alex Johnson',
    action: 'Commented on build #123',
    timestamp: '5 hours ago',
  },
  {
    id: '4',
    user: 'Sarah Williams',
    action: 'Published a new build',
    timestamp: '1 day ago',
  },
];

export function ActivityFeed() {
  const logger = useLogger('ActivityFeed', LogCategory.ADMIN);

  React.useEffect(() => {
    logger.info('Activity feed component mounted');
    return () => {
      logger.info('Activity feed component unmounted');
    };
  }, [logger]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
