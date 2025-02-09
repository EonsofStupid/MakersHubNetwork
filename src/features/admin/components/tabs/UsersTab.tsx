
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const UsersTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">User management features coming soon...</p>
      </CardContent>
    </Card>
  );
};

