
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

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
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0 border-muted">
              <div className={`w-2 h-2 mt-2 rounded-full bg-${activity.type === 'system' ? 'blue' : activity.type === 'error' ? 'red' : 'green'}-500`} />
              <div>
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const activities = [
  {
    type: 'user',
    message: 'User login from new device',
    time: '2 minutes ago'
  },
  {
    type: 'system',
    message: 'System update completed',
    time: '10 minutes ago'
  },
  {
    type: 'error',
    message: 'API rate limit reached',
    time: '25 minutes ago'
  },
  {
    type: 'user',
    message: 'New user registered',
    time: '1 hour ago'
  },
  {
    type: 'system',
    message: 'Database backup successful',
    time: '2 hours ago'
  }
];
