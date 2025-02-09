
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserActivity } from '@/hooks/useUserActivity';
import { Users, UserCheck } from 'lucide-react';

export const UsersTab = () => {
  const { data: userActivityData, isLoading, error } = useUserActivity({
    enabled: true
  });

  console.log('UsersTab - Component render:', {
    isLoading,
    error,
    data: userActivityData,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Track user accounts and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : userActivityData?.stats.activeUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Users active in the last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : userActivityData?.stats.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total registered accounts
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
