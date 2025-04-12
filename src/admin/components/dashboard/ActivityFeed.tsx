
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CheckCircle, XCircle, User, Package, Wrench, Settings, Clock } from "lucide-react";

// Activity types with different colors
const activityTypes = {
  build_submission: { 
    icon: <Package className="h-4 w-4" />, 
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  build_approval: { 
    icon: <CheckCircle className="h-4 w-4" />, 
    color: "bg-green-500/10 text-green-500 border-green-500/20"
  },
  build_rejection: { 
    icon: <XCircle className="h-4 w-4" />, 
    color: "bg-red-500/10 text-red-500 border-red-500/20"
  },
  user_joined: { 
    icon: <User className="h-4 w-4" />, 
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  },
  settings_updated: { 
    icon: <Settings className="h-4 w-4" />, 
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  }
};

// Mock activity data
const activities = [
  {
    id: 1,
    type: "build_submission",
    user: { name: "John Smith", initials: "JS", avatar: null },
    content: "submitted a new build: \"Voron 2.4 350mm Custom\"",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    type: "user_joined",
    user: { name: "Emily Wilson", initials: "EW", avatar: null },
    content: "joined as a new maker",
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    type: "build_approval",
    user: { name: "Admin", initials: "A", avatar: null },
    content: "approved \"Ender 3 V3 SE Modified\" by Mark Johnson",
    timestamp: "8 hours ago"
  },
  {
    id: 4,
    type: "settings_updated",
    user: { name: "Admin", initials: "A", avatar: null },
    content: "updated the platform appearance settings",
    timestamp: "1 day ago"
  },
  {
    id: 5,
    type: "build_rejection",
    user: { name: "Admin", initials: "A", avatar: null },
    content: "rejected \"Incomplete Build\" by Sarah Andrews",
    timestamp: "1 day ago"
  }
];

export function ActivityFeed() {
  return (
    <Card className="bg-card/80 backdrop-blur-md border border-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </div>
          
          <Badge variant="outline" className="font-normal text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" /> 
            Real-time
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const activityType = activityTypes[activity.type as keyof typeof activityTypes];
            
            return (
              <div key={activity.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar || ""} />
                  <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-sm">{activity.user.name} </span>
                      <span className="text-sm text-muted-foreground">{activity.content}</span>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${activityType.color} flex items-center gap-1`}
                    >
                      {activityType.icon}
                      <span className="capitalize">{activity.type.replace("_", " ")}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="text-xs">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
