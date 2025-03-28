
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UsersIcon, PackageIcon, FileTextIcon, EyeIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed() {
  // Sample activity data - in a real app, this would come from an API
  const activities = [
    {
      id: 1,
      type: "user",
      title: "New user registered",
      subject: "John Maker",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: <UsersIcon className="w-5 h-5" />
    },
    {
      id: 2,
      type: "build",
      title: "New build submitted",
      subject: "Ender 3 V3 Upgrade Kit",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      icon: <PackageIcon className="w-5 h-5" />
    },
    {
      id: 3,
      type: "content",
      title: "Content updated",
      subject: "Getting Started Guide",
      timestamp: new Date(Date.now() - 18000000), // 5 hours ago
      icon: <FileTextIcon className="w-5 h-5" />
    }
  ];

  return (
    <Card className="bg-card/80 backdrop-blur-md border border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
          <EyeIcon className="w-4 h-4" />
          <span>View All</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  activity: {
    id: number;
    type: string;
    title: string;
    subject: string;
    timestamp: Date;
    icon: React.ReactNode;
  };
}

function ActivityItem({ activity }: ActivityItemProps) {
  // Get the color for the activity type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "text-blue-500";
      case "build":
        return "text-green-500";
      case "content":
        return "text-purple-500";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)]">
      <div className={`${getTypeColor(activity.type)} p-2 rounded-full bg-black/10`}>
        {activity.icon}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium">
          {activity.title}: <span className={getTypeColor(activity.type)}>{activity.subject}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
        </p>
      </div>
      
      <Badge variant="outline" className="capitalize">
        {activity.type}
      </Badge>
    </div>
  );
}
