import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";

type ActiveUser = {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'away';
  lastActivity: string;
};

const MOCK_USERS: ActiveUser[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    avatar: '/avatars/01.png',
    status: 'active',
    lastActivity: '2 minutes ago'
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: '/avatars/02.png',
    status: 'active',
    lastActivity: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Alex Smith',
    status: 'away',
    lastActivity: '1 hour ago'
  }
];

export function ActiveUsersList() {
  return (
    <Card className="cyber-card border-primary/20">
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_USERS.map(user => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Last active: {user.lastActivity}</p>
                </div>
              </div>
              <Badge 
                variant={user.status === 'active' ? 'default' : 'secondary'}
                className={user.status === 'away' ? 'bg-amber-500/10 text-amber-500' : ''}
              >
                {user.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
