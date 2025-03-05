
import React from 'react';
import { useActiveUsers } from '@/admin/hooks/useActiveUsers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const ActiveUsersList = () => {
  const { data: activeUsers, isLoading, error } = useActiveUsers();
  
  if (isLoading) {
    return (
      <Card className="cyber-card border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle>Active Users</CardTitle>
          <CardDescription>Recently active platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-primary/20 rounded"></div>
                    <div className="h-3 w-24 bg-primary/10 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-primary/10 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="cyber-card border-destructive/20">
        <CardHeader className="pb-2">
          <CardTitle>Active Users</CardTitle>
          <CardDescription>Error loading user data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load active users</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="cyber-card border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle>Active Users</CardTitle>
        <CardDescription>Recently active platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeUsers && activeUsers.length > 0 ? (
            activeUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-2 border-b border-primary/10">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary/10">{user.display_name?.substring(0, 2) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.display_name || 'Anonymous User'}</p>
                    <p className="text-xs text-muted-foreground">Last active: {user.last_seen ? new Date(user.last_seen).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {user.status || 'Online'}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">No active users found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
