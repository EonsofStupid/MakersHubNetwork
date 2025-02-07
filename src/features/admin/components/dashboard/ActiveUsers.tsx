import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveUsers } from '../../queries/useActiveUsers';

export const ActiveUsers = () => {
  const { data: activeUsers, isLoading } = useActiveUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
        <CardDescription>Currently active users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold">
            {isLoading ? '...' : activeUsers?.length || 0}
          </p>
          {activeUsers?.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              {user.avatar_url && (
                <img 
                  src={user.avatar_url} 
                  alt={user.display_name || 'User'} 
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>{user.display_name}</span>
              <div className="flex gap-1">
                {user.user_roles?.map((role) => (
                  <span 
                    key={role.id} 
                    className="text-xs bg-primary/10 px-2 py-0.5 rounded-full"
                  >
                    {role.role}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};